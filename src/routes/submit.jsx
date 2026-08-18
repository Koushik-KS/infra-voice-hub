import { useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Languages,
  Mic,
  MessageSquare,
  Type as TypeIcon,
  Send,
  LocateFixed,
  Sparkles,
  CheckCircle2,
  Loader2,
  MicOff,
} from "lucide-react";

import { PageHeader } from "@/components/AppShell";
import { SectionCard } from "@/components/ui/Card";

import {
  Badge,
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "@/components/ui/Badge";

import {
  Button,
  Label,
  Select,
  TextArea,
  TextInput,
} from "@/components/ui/Field";

import { ErrorState } from "@/components/ui/States";

import {
  COUNTRIES,
  DISTRICTS_BY_STATE,
  LANGUAGES,
  LANGUAGE_NAMES,
  STATES_BY_COUNTRY,
} from "@/lib/constants";

import { createRequest } from "@/lib/api";

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      {
        title: "Report a Development Need — CivilIntel",
      },
      {
        name: "description",
        content:
          "Submit an infrastructure or public service concern in your own language by text, voice or messaging.",
      },
    ],
  }),
  component: SubmitPage,
});

const MAX_CHARS = 1200;

const TABS = [
  { key: "Text", icon: TypeIcon },
  { key: "Voice", icon: Mic },
  { key: "Messaging", icon: MessageSquare },
];

const VOICE_LANGUAGES = [
  { label: "Kannada", value: "kn-IN" },
  { label: "English", value: "en-IN" },
  { label: "Hindi", value: "hi-IN" },
  { label: "Tamil", value: "ta-IN" },
  { label: "Telugu", value: "te-IN" },
  { label: "Malayalam", value: "ml-IN" },
];

function detectLanguage(text) {
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn";
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
  if (/[\u0C00-\u0C7F]/.test(text)) return "te";
  if (/[\u0D00-\u0D7F]/.test(text)) return "ml";
  if (/[\u0400-\u04FF]/.test(text)) return "ru";
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh";

  return "en";
}

function getBackendSource(source) {
  const sources = {
    Text: "Web",
    Voice: "Voice",
    Messaging: "WhatsApp",
  };

  return sources[source] || "Web";
}

function SubmitPage() {
  const [source, setSource] = useState("Text");
  const [citizenName, setCitizenName] = useState("");
  const [message, setMessage] = useState("");

  const [country, setCountry] = useState("India");
  const [state, setState] = useState("Karnataka");
  const [district, setDistrict] = useState("Chikkamagaluru");

  // Voice language selected by citizen
  const [voiceLanguage, setVoiceLanguage] = useState("kn-IN");

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const [listening, setListening] = useState(false);
  const [voiceNote, setVoiceNote] = useState("");

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");

  const states = STATES_BY_COUNTRY[country] ?? [];
  const districts = DISTRICTS_BY_STATE[state] ?? [];

  const detected = useMemo(
    () => detectLanguage(message),
    [message]
  );

  function onCountryChange(value) {
    setCountry(value);

    const nextStates = STATES_BY_COUNTRY[value] ?? [];
    const nextState = nextStates[0] ?? "";

    setState(nextState);

    setDistrict(
      (DISTRICTS_BY_STATE[nextState] ?? [])[0] ?? ""
    );
  }

  function onStateChange(value) {
    setState(value);

    setDistrict(
      (DISTRICTS_BY_STATE[value] ?? [])[0] ?? ""
    );
  }

  function useCurrentLocation() {
    if (!("geolocation" in navigator)) {
      setError(
        "Geolocation is not available in this browser."
      );
      return;
    }

    setError(null);

    navigator.geolocation.getCurrentPosition(
      () => {
        // Current project location defaults
        setCountry("India");
        setState("Karnataka");
        setDistrict("Chikkamagaluru");
      },
      () => {
        setError(
          "Location permission denied. Please select Country, State and District manually."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  function startVoiceRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNote(
        "Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge."
      );
      return;
    }

    setVoiceNote("");
    setError(null);

    const recognition = new SpeechRecognition();

    // IMPORTANT: Uses selected language
    recognition.lang = voiceLanguage;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    finalTranscriptRef.current = message
      ? `${message} `
      : "";

    recognition.onstart = () => {
      setListening(true);
      setVoiceNote("Microphone is active. Speak now...");
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i += 1
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        finalTranscriptRef.current += finalTranscript;
      }

      setMessage(
        `${finalTranscriptRef.current}${interimTranscript}`
          .trim()
          .slice(0, MAX_CHARS)
      );
    };

    recognition.onerror = (event) => {
      setListening(false);

      const errors = {
        "not-allowed":
          "Microphone permission was denied. Allow microphone access in your browser.",
        "service-not-allowed":
          "Speech recognition service is not allowed.",
        "no-speech":
          "No speech was detected. Please try again.",
        "audio-capture":
          "No microphone was found on this device.",
        network:
          "Speech recognition needs an internet connection.",
      };

      setVoiceNote(
        errors[event.error] ||
          `Voice recognition error: ${event.error}`
      );
    };

    recognition.onend = () => {
      setListening(false);

      if (finalTranscriptRef.current.trim()) {
        setVoiceNote(
          "Voice recording stopped. You can review the recognized text below."
        );
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setVoiceNote(
        "Voice recognition is already starting. Please wait a moment."
      );
    }
  }

  function stopVoiceRecognition() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  function toggleVoice() {
    if (listening) {
      stopVoiceRecognition();
    } else {
      startVoiceRecognition();
    }
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (!message.trim()) {
      setError(
        "Please enter or record your development request."
      );
      return;
    }

    setStatus("loading");
    setError(null);
    setResult(null);

    const payload = {
      citizenName:
        citizenName.trim() || "Anonymous Citizen",

      requestText: message.trim(),

      language: detectLanguage(message),

      country,
      state,
      district,

      source: getBackendSource(source),
    };

    try {
      const response = await createRequest(payload);

      // Supports both:
      // { success: true, data: {...} }
      // and direct {...}
      const data = response?.data || response;

      setResult({
        language:
          data?.language ??
          detectLanguage(message),

        category:
          data?.category ?? "Other",

        priority:
          data?.priority ?? "Medium",

        status:
          data?.status ?? "Received",
      });

      setStatus("success");
      setMessage("");
      setVoiceNote("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Submission failed"
      );

      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Report a Development Need"
        subtitle="Help shape development priorities in your region. Submit your infrastructure or public service concern."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <form
          onSubmit={onSubmit}
          className="space-y-4 lg:col-span-2"
        >
          <SectionCard
            title="Input method"
            subtitle="Choose how you want to share your concern"
          >
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setSource(tab.key);
                    setVoiceNote("");
                  }}
                  className={
                    "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-all duration-200 " +
                    (source === tab.key
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground")
                  }
                >
                  <tab.icon className="size-4" />
                  {tab.key}
                </button>
              ))}
            </div>

            {/* VOICE SECTION */}
            {source === "Voice" && (
              <div className="mt-4 flex flex-col items-center gap-4 rounded-lg border border-border bg-muted/50 py-6">
                
                {/* Voice language dropdown */}
                <div className="w-full max-w-xs px-4">
                  <label
                    htmlFor="voiceLanguage"
                    className="mb-2 block text-xs font-semibold"
                  >
                    Select Voice Language
                  </label>

                  <select
                    id="voiceLanguage"
                    value={voiceLanguage}
                    onChange={(e) =>
                      setVoiceLanguage(e.target.value)
                    }
                    disabled={listening}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none"
                  >
                    {VOICE_LANGUAGES.map((lang) => (
                      <option
                        key={lang.value}
                        value={lang.value}
                      >
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Microphone */}
                <button
                  type="button"
                  onClick={toggleVoice}
                  aria-label={
                    listening
                      ? "Stop recording"
                      : "Start recording"
                  }
                  className={
                    "relative flex size-16 items-center justify-center rounded-full transition-all duration-200 " +
                    (listening
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-primary text-primary-foreground hover:scale-105")
                  }
                >
                  {listening && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-destructive/40" />
                  )}

                  {listening ? (
                    <MicOff className="size-6" />
                  ) : (
                    <Mic className="size-6" />
                  )}
                </button>

                <p className="text-sm font-semibold">
                  {listening
                    ? "Listening… speak now"
                    : "Tap the microphone to speak"}
                </p>

                <p className="text-xs text-muted-foreground">
                  Selected:{" "}
                  <span className="font-semibold">
                    {
                      VOICE_LANGUAGES.find(
                        (lang) =>
                          lang.value === voiceLanguage
                      )?.label
                    }
                  </span>
                </p>

                {voiceNote && (
                  <p className="px-6 text-center text-xs text-warning">
                    {voiceNote}
                  </p>
                )}

                <div className="mx-6 w-full max-w-md rounded-lg border border-dashed border-border bg-card px-3 py-3 text-xs text-muted-foreground">
                  {message ? (
                    <span className="text-foreground">
                      {message}
                    </span>
                  ) : (
                    "Your recognized speech will appear here."
                  )}
                </div>
              </div>
            )}

            {source === "Messaging" && (
              <p className="mt-4 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
                Messaging requests can come from WhatsApp or other
                supported messaging channels. Type or paste the
                citizen message below.
              </p>
            )}
          </SectionCard>

          {/* DEVELOPMENT REQUEST */}
          <SectionCard
            title="Development request"
            subtitle="Describe the problem in your own words"
          >
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="name"
                  hint="optional"
                >
                  Citizen Name
                </Label>

                <TextInput
                  id="name"
                  value={citizenName}
                  onChange={(e) =>
                    setCitizenName(e.target.value)
                  }
                  placeholder="Anonymous Citizen"
                />
              </div>

              <div>
                <Label htmlFor="message">
                  Development Request / Message
                </Label>

                <TextArea
                  id="message"
                  required
                  maxLength={MAX_CHARS}
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  placeholder="Describe the development problem in your area. You can write in your preferred language."
                />

                <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Example: ನಮ್ಮ ಊರಿನಲ್ಲಿ ಕುಡಿಯುವ ನೀರಿನ ಸಮಸ್ಯೆ ಇದೆ
                  </span>

                  <span className="tabular-nums">
                    {message.length}/{MAX_CHARS}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <Label htmlFor="country">
                    Country
                  </Label>

                  <Select
                    id="country"
                    value={country}
                    onChange={(e) =>
                      onCountryChange(e.target.value)
                    }
                    options={COUNTRIES}
                  />
                </div>

                <div>
                  <Label htmlFor="state">
                    State
                  </Label>

                  <Select
                    id="state"
                    value={state}
                    onChange={(e) =>
                      onStateChange(e.target.value)
                    }
                    options={states}
                  />
                </div>

                <div>
                  <Label htmlFor="district">
                    District
                  </Label>

                  <Select
                    id="district"
                    value={district}
                    onChange={(e) =>
                      setDistrict(e.target.value)
                    }
                    options={districts}
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={useCurrentLocation}
              >
                <LocateFixed className="size-4" />
                Use Current Location
              </Button>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}

                {status === "loading"
                  ? "Analyzing with CivilIntel AI…"
                  : "Analyze & Submit Request"}
              </Button>
            </div>
          </SectionCard>

          {status === "error" && (
            <div className="surface-card">
              <ErrorState
                message={error}
                onRetry={() => {
                  setStatus("idle");
                  setError(null);
                }}
              />
            </div>
          )}

          {status === "success" && result && (
            <div className="surface-card overflow-hidden">
              <div className="flex items-center gap-3 border-b border-border bg-success/10 px-5 py-4">
                <span className="flex size-9 items-center justify-center rounded-lg bg-success/15 text-success">
                  <CheckCircle2 className="size-5" />
                </span>

                <div>
                  <p className="text-sm font-semibold">
                    AI Analysis Complete
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Your request has been saved successfully in
                    MongoDB.
                  </p>
                </div>
              </div>

              <dl className="grid gap-4 px-5 py-4 sm:grid-cols-4">
                <div>
                  <dt className="text-eyebrow">
                    Detected Language
                  </dt>

                  <dd className="mt-1.5 text-sm font-semibold">
                    {LANGUAGE_NAMES[result.language] ??
                      result.language}
                  </dd>
                </div>

                <div>
                  <dt className="text-eyebrow">
                    Category
                  </dt>

                  <dd className="mt-1.5">
                    <CategoryBadge
                      category={result.category}
                    />
                  </dd>
                </div>

                <div>
                  <dt className="text-eyebrow">
                    Priority
                  </dt>

                  <dd className="mt-1.5">
                    <PriorityBadge
                      level={result.priority}
                    />
                  </dd>
                </div>

                <div>
                  <dt className="text-eyebrow">
                    Status
                  </dt>

                  <dd className="mt-1.5">
                    <StatusBadge
                      status={result.status}
                    />
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </form>

        <div className="space-y-4">
          <SectionCard
            title="Multilingual by design"
            icon={Languages}
          >
            <p className="text-xs text-muted-foreground">
              AI supports multilingual requests. Write or speak in
              your preferred language.
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {LANGUAGES.map((lang) => (
                <Badge
                  key={lang.code}
                  tone={
                    detected === lang.code
                      ? "primary"
                      : "neutral"
                  }
                >
                  {lang.label}
                </Badge>
              ))}
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Detected in your message:{" "}
              <span className="font-semibold text-foreground">
                {LANGUAGE_NAMES[detected]}
              </span>
            </p>
          </SectionCard>

          <SectionCard
            title="What happens next"
            icon={Sparkles}
          >
            <ol className="space-y-3 text-xs text-muted-foreground">
              {[
                "The request is received from the citizen.",
                "CivilIntel detects the development category.",
                "Urgency is analyzed to assign priority.",
                "The request is saved and contributes to the regional demand model.",
              ].map((step, i) => (
                <li
                  key={step}
                  className="flex gap-2.5"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}