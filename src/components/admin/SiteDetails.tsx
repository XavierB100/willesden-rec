import { Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "./Field";
import type { AdminWorkspace } from "./useAdminWorkspace";

export function SiteDetails({ workspace: w }: { workspace: AdminWorkspace }) {
  const s = w.settings;
  const hours = w.settingsText.openingHours.split("\n").map((line) => {
    const colon = line.indexOf(":");
    return {
      label: colon < 0 ? line : line.slice(0, colon),
      value: colon < 0 ? "" : line.slice(colon + 1).trimStart(),
    };
  });
  function setHours(rows: typeof hours) {
    w.setSettingsText({
      ...w.settingsText,
      openingHours: rows.map((row) => `${row.label}: ${row.value}`).join("\n"),
    });
  }
  const disabled = w.isLoading || w.isUploading || !w.dataReady;
  return (
    <section>
      <div className="workspace-heading">
        <div>
          <p className="eyebrow">Keep in touch</p>
          <h1>Yard details</h1>
          <p>The details customers use to find you.</p>
        </div>
        <span
          className={`status-badge ${w.settingsDirty ? "unsaved" : "available"}`}
        >
          {w.settingsDirty ? "Unsaved changes" : "Saved"}
        </span>
      </div>
      <form onSubmit={w.handleSettingsSubmit}>
        <fieldset disabled={disabled} className="settings-grid">
          <div className="space-y-6">
            <section className="editor-panel">
              <div className="panel-heading">
                <h2>Contact & location</h2>
              </div>
              <div className="field-grid">
                <Field label="Business name *" wide>
                  <input
                    required
                    value={s.businessName}
                    onChange={(e) =>
                      w.setSettings({ ...s, businessName: e.target.value })
                    }
                  />
                </Field>
                <Field label="Phone number *">
                  <input
                    required
                    type="tel"
                    value={s.phone}
                    onChange={(e) =>
                      w.setSettings({ ...s, phone: e.target.value })
                    }
                  />
                </Field>
                <Field
                  label="WhatsApp number *"
                  hint="Include the country code, e.g. 447907020909."
                >
                  <input
                    required
                    type="tel"
                    value={s.whatsappNumber}
                    onChange={(e) =>
                      w.setSettings({ ...s, whatsappNumber: e.target.value })
                    }
                  />
                </Field>
                <Field label="Email address *" wide>
                  <input
                    required
                    type="email"
                    value={s.email}
                    onChange={(e) =>
                      w.setSettings({ ...s, email: e.target.value })
                    }
                  />
                </Field>
                <Field
                  label="Yard address *"
                  wide
                  hint="One line for each part of the address."
                >
                  <textarea
                    required
                    rows={3}
                    value={w.settingsText.addressLines}
                    onChange={(e) =>
                      w.setSettingsText({
                        ...w.settingsText,
                        addressLines: e.target.value,
                      })
                    }
                  />
                </Field>
              </div>
            </section>
            <section className="editor-panel">
              <div className="panel-heading">
                <h2>Map & directions</h2>
              </div>
              <Field
                label="Google Maps embed"
                hint="In Google Maps, choose Share → Embed a map. Paste the embed code or its URL."
              >
                <textarea
                  rows={3}
                  value={s.mapEmbedUrl}
                  onChange={(e) =>
                    w.setSettings({ ...s, mapEmbedUrl: e.target.value })
                  }
                />
              </Field>
            </section>
          </div>
          <section className="editor-panel self-start">
            <div className="panel-heading">
              <h2>Opening hours</h2>
            </div>
            <p className="field-help">
              Group days with the same hours. Use “Closed” for days you’re away.
            </p>
            <div className="space-y-4">
              {hours.map((row, i) => (
                <div className="hours-row" key={i}>
                  <Field label={`Days ${i + 1}`}>
                    <input
                      aria-label={`Days ${i + 1}`}
                      required
                      value={row.label}
                      placeholder="Monday – Friday"
                      onChange={(e) =>
                        setHours(
                          hours.map((r, j) =>
                            j === i
                              ? {
                                  ...r,
                                  label: e.target.value.replaceAll(":", ""),
                                }
                              : r,
                          ),
                        )
                      }
                    />
                  </Field>
                  <Field label={`Hours ${i + 1}`}>
                    <input
                      aria-label={`Hours ${i + 1}`}
                      required
                      value={row.value}
                      placeholder="9:00 AM – 5:00 PM"
                      onChange={(e) =>
                        setHours(
                          hours.map((r, j) =>
                            j === i ? { ...r, value: e.target.value } : r,
                          ),
                        )
                      }
                    />
                  </Field>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`Remove opening hours row ${i + 1}`}
                    disabled={hours.length <= 1}
                    onClick={() => setHours(hours.filter((_, j) => j !== i))}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="ghost"
              className="mt-4"
              disabled={hours.length >= 14}
              onClick={() => setHours([...hours, { label: "", value: "" }])}
            >
              <Plus size={16} /> Add hours
            </Button>
          </section>
        </fieldset>
        <div className="editor-savebar">
          <p>
            <span className={`save-dot ${w.settingsDirty ? "dirty" : ""}`} />
            {w.settingsDirty
              ? "You have unsaved changes"
              : "Your public contact details"}
          </p>
          <Button type="submit" disabled={disabled}>
            <Save size={17} />
            {w.isLoading ? "Saving…" : "Save yard details"}
          </Button>
        </div>
      </form>
    </section>
  );
}
