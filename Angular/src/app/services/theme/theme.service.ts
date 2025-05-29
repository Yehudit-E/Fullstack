import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

export interface ThemeSettings {
  theme: "dark" | "light"
  accentColor: string
  fontSize: "small" | "medium" | "large"
}

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private readonly STORAGE_KEY = "app_theme_settings"

  // Default theme settings
  private defaultSettings: ThemeSettings = {
    theme: "dark",
    accentColor: "#d59039", // Default gold accent
    fontSize: "medium",
  }

  // BehaviorSubject to track theme changes
  private _themeSettings = new BehaviorSubject<ThemeSettings>(this.defaultSettings)
  public themeSettings = this._themeSettings.asObservable()

  constructor() {
    this.loadSettings()
    this.applyTheme(this._themeSettings.value)
  }

  private loadSettings(): void {
    try {
      const savedSettings = localStorage.getItem(this.STORAGE_KEY)
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings) as ThemeSettings
        this._themeSettings.next(parsedSettings)
      }
    } catch (error) {
      console.error("Error loading theme settings:", error)
    }
  }

  private saveSettings(settings: ThemeSettings): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error("Error saving theme settings:", error)
    }
  }

  public updateTheme(theme: "dark" | "light"): void {
    const currentSettings = this._themeSettings.value
    const newSettings = { ...currentSettings, theme }
    this._themeSettings.next(newSettings)
    this.saveSettings(newSettings)
    this.applyTheme(newSettings)
  }

  public updateAccentColor(accentColor: string): void {
    const currentSettings = this._themeSettings.value
    const newSettings = { ...currentSettings, accentColor }
    this._themeSettings.next(newSettings)
    this.saveSettings(newSettings)
    this.applyTheme(newSettings)
  }

  public updateFontSize(fontSize: "small" | "medium" | "large"): void {
    const currentSettings = this._themeSettings.value
    const newSettings = { ...currentSettings, fontSize }
    this._themeSettings.next(newSettings)
    this.saveSettings(newSettings)
    this.applyTheme(newSettings)
  }

  private applyTheme(settings: ThemeSettings): void {
    // Apply theme (dark/light)
    document.documentElement.classList.remove("dark", "light")
    document.documentElement.classList.add(settings.theme)

    // Apply accent color
    document.documentElement.style.setProperty("--accent-color", settings.accentColor)
    document.documentElement.style.setProperty(
      "--primary-gradient",
      `linear-gradient(90deg, ${settings.accentColor}, ${this.lightenColor(settings.accentColor, 20)})`,
    )

    // Apply font size
    document.documentElement.classList.remove("text-small", "text-medium", "text-large")
    document.documentElement.classList.add(`text-${settings.fontSize}`)

    // Update derived colors
    const accentLight = this.lightenColor(settings.accentColor, 40)
    const accentDark = this.darkenColor(settings.accentColor, 20)
    document.documentElement.style.setProperty("--accent-color-light", accentLight)
    document.documentElement.style.setProperty("--accent-color-dark", accentDark)
  }

  // Helper function to lighten a color
  private lightenColor(color: string, percent: number): string {
    const hex = color.replace("#", "")
    const r = Number.parseInt(hex.substr(0, 2), 16)
    const g = Number.parseInt(hex.substr(2, 2), 16)
    const b = Number.parseInt(hex.substr(4, 2), 16)

    const lightenValue = (value: number): number => {
      return Math.min(255, Math.floor(value + (255 - value) * (percent / 100)))
    }

    const rr = lightenValue(r).toString(16).padStart(2, "0")
    const gg = lightenValue(g).toString(16).padStart(2, "0")
    const bb = lightenValue(b).toString(16).padStart(2, "0")

    return `#${rr}${gg}${bb}`
  }

  // Helper function to darken a color
  private darkenColor(color: string, percent: number): string {
    const hex = color.replace("#", "")
    const r = Number.parseInt(hex.substr(0, 2), 16)
    const g = Number.parseInt(hex.substr(2, 2), 16)
    const b = Number.parseInt(hex.substr(4, 2), 16)

    const darkenValue = (value: number): number => {
      return Math.max(0, Math.floor(value * (1 - percent / 100)))
    }

    const rr = darkenValue(r).toString(16).padStart(2, "0")
    const gg = darkenValue(g).toString(16).padStart(2, "0")
    const bb = darkenValue(b).toString(16).padStart(2, "0")

    return `#${rr}${gg}${bb}`
  }
}
