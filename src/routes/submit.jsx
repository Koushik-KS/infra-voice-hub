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
import { Badge, CategoryBadge, PriorityBadge, StatusBadge } from "@/components/ui/Badge";
import { Button, Label, Select, TextArea, TextInput } from "@/components/ui/Field";
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
      { title: "Report a Development Need — CivilIntel" },
      {
        name: "description",
        content:
          "Submit an infrastructure or public service concern in your own language by text, voice or messaging.",
      },
      { property: "og:title", content: "Report a Development Need — CivilIntel" },
      {
        property: "og:description",
        content: "Help shape development priorities in your region with a multilingual request.",
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

function detectLanguage(text) {
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn";
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  if (/[\u0400-\u04FF]/.test(text)) return "ru";
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh";
  if (/[ãõçáéíóú]/i.test(text)) return "pt";
  return "en";
}

function SubmitPage() {
  const [source, setSource] = useState("Text");
  const [citizenName, setCitizenName] = useState("");
  const [message, setMessage] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("Karnataka");
  const [district, setDistrict] = useState("Chikkamagaluru");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [listening, setListening] = useState(false);
  const [voiceNote, setVoiceNote] = useState("");
  const recognitionRef = useRef(null);

  const states = STATES_BY_COUNTRY[country] ?? [];
  const districts = DISTRICTS_BY_STATE[state] ?? [];
  const detected = useMemo(() => detectLanguage(message), [message]);

  function onCountryChange(value) {
    setCountry(value);
    const nextStates = STATES_BY_COUNTRY[value] ?? [];
    setState(nextStates[0] ?? "");
    setDistrict((DISTRICTS_BY_STATE[nextStates[0]] ?? [])[0] ?? "");
  }

  function onStateChange(value) {
    setState(value);
    setDistrict((DISTRICTS_BY_STATE[value] ?? [])[0] ?? "");
  }

  function useCurrentLocation() {
    if (!("geolocation" in navigator)) {
      setVoiceNote("Geolocation is not available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setCountry("India");
        setState("Karnataka");
        setDistrict("Chikkamagaluru");
      },
      () => setError("Location permission denied — please select your district manually."),
    );
  }

  function toggleVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setVoiceNote("Speech recognition is not supported in this browser. Please use the Text tab.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new SR();
    recognition.lang = detected === "en" ? "en-IN" : `${detected}-IN`;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      setMessage((prev) => `${prev}${transcript}`.slice(0, MAX_CHARS));
    };
    recognition.onerror = () => {
      setListening(false);
      setVoiceNote("Could not capture audio. Try again or use the Text tab.");
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    setVoiceNote("");
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("loading");
    setError(null);
    setResult(null);
    const payload = {
      citizenName: citizenName.trim() || "Anonymous Citizen",
      message: message.trim(),
      language: detected,
      location: { country, state, district },
      source,
    };
    try {
      const data = await createRequest(payload);
      setResult({
        language: data?.language ?? detected,
        category: data?.category ?? "Water",
        priority: data?.priority ?? "High",
        status: data?.status ?? "Submitted Successfully",
        live: true,
      });
      setStatus("success");
      setMessage("");
    } catch (err) {
      setError(err?.message || "Submission failed");
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
        <form onSubmit={onSubmit} className="space-y-4 lg:col-span-2">
          <SectionCard title="Input method" subtitle="Choose how you want to share your concern">
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSource(tab.key)}
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

            {source === "Voice" && (
              <div className="mt-4 flex flex-col items-center gap-3 rounded-lg border border-border bg-muted/50 py-6">
                <button
                  type="button"
                  onClick={toggleVoice}
                  aria-label={listening ? "Stop recording" : "Start recording"}
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
                  {listening ? <MicOff className="size-6" /> : <Mic className="size-6" />}
                </button>
                <p className="text-xs font-semibold">
                  {listening ? "Listening… speak now" : "Tap to speak in your language"}
                </p>
                {voiceNote && <p className="px-6 text-center text-xs text-warning">{voiceNote}</p>}
                <div className="mx-6 w-full max-w-md rounded-lg border border-dashed border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                  {message ? <span className="text-foreground">{message}</span> : "Recognized speech appears here."}
                </div>
              </div>
            )}

            {source === "Messaging" && (
              <p className="mt-4 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
                Messaging channel requests arrive from WhatsApp / SMS gateways. Paste or type the
                citizen message below to record it manually.
              </p>
            )}
          </SectionCard>

          <SectionCard title="Development request" subtitle="Describe the problem in your own words">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" hint="optional">
                  Citizen Name
                </Label>
                <TextInput
                  id="name"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="Anonymous Citizen"
                />
              </div>

              <div>
                <Label htmlFor="message">Development Request / Message</Label>
                <TextArea
                  id="message"
                  required
                  maxLength={MAX_CHARS}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe the development problem in your area. You can write in your preferred language."
                />
                <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Example: ನಮ್ಮ ಊರಿನಲ್ಲಿ ಕುಡಿಯುವ ನೀರಿನ ಸಮಸ್ಯೆ ಇದೆ</span>
                  <span className="tabular-nums">
                    {message.length}/{MAX_CHARS}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    id="country"
                    value={country}
                    onChange={(e) => onCountryChange(e.target.value)}
                    options={COUNTRIES}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select id="state" value={state} onChange={(e) => onStateChange(e.target.value)} options={states} />
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Select
                    id="district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    options={districts}
                  />
                </div>
              </div>

              <Button type="button" variant="outline" size="sm" onClick={useCurrentLocation}>
                <LocateFixed className="size-4" />
                Use Current Location
              </Button>

              <Button type="submit" size="lg" className="w-full" disabled={status === "loading"}>
                {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                {status === "loading" ? "Analyzing with CivilIntel AI…" : "Analyze & Submit Request"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Category and priority are detected automatically by CivilIntel AI.
              </p>
            </div>
          </SectionCard>

          {status === "error" && (
            <div className="surface-card">
              <ErrorState message={error} onRetry={() => setStatus("idle")} />
            </div>
          )}

          {status === "success" && result && (
            <div className="surface-card overflow-hidden">
              <div className="flex items-center gap-3 border-b border-border bg-success/10 px-5 py-4">
                <span className="flex size-9 items-center justify-center rounded-lg bg-success/15 text-success">
                  <CheckCircle2 className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">AI Analysis Complete</p>
                  <p className="text-xs text-muted-foreground">
                    Your request has been added to the regional demand model.
                  </p>
                </div>
              </div>
              <dl className="grid gap-4 px-5 py-4 sm:grid-cols-4">
                <div>
                  <dt className="text-eyebrow">Detected Language</dt>
                  <dd className="mt-1.5 text-sm font-semibold">
                    {LANGUAGE_NAMES[result.language] ?? result.language}
                  </dd>
                </div>
                <div>
                  <dt className="text-eyebrow">Category</dt>
                  <dd className="mt-1.5">
                    <CategoryBadge category={result.category} />
                  </dd>
                </div>
                <div>
                  <dt className="text-eyebrow">Priority</dt>
                  <dd className="mt-1.5">
                    <PriorityBadge level={result.priority} />
                  </dd>
                </div>
                <div>
                  <dt className="text-eyebrow">Status</dt>
                  <dd className="mt-1.5">
                    <StatusBadge status={result.status} />
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </form>

        <div className="space-y-4">
          <SectionCard title="Multilingual by design" icon={Languages}>
            <p className="text-xs text-muted-foreground">
              AI supports multilingual requests — write or speak in the language you are most
              comfortable with.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {LANGUAGES.map((lang) => (
                <Badge key={lang.code} tone={detected === lang.code ? "primary" : "neutral"}>
                  {lang.label}
                </Badge>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Detected in your message:{" "}
              <span className="font-semibold text-foreground">{LANGUAGE_NAMES[detected]}</span>
            </p>
          </SectionCard>

          <SectionCard title="What happens next" icon={Sparkles}>
            <ol className="space-y-3 text-xs text-muted-foreground">
              {[
                "AI detects the language and translates the request.",
                "The concern is classified into a development category.",
                "Urgency is scored to assign a priority level.",
                "Your voice joins the district demand model used for investment decisions.",
              ].map((step, i) => (
                <li key={step} className="flex gap-2.5">
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
