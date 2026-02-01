import { Engine, Color, vec, Label, Font, FontUnit, ScreenElement, Actor } from "excalibur";
import { UITabbedPanel } from "../../excalibur-ui/Components";

// Example usage of UITabbedPanel
export class TabbedPanelExample {
  private engine: Engine;
  private tabbedPanel: UITabbedPanel | null = null;

  constructor(engine: Engine) {
    this.engine = engine;
    this.setupTabbedPanel();
  }

  private setupTabbedPanel(): void {
    // Create a tabbed panel
    this.tabbedPanel = new UITabbedPanel({
      name: "ExampleTabbedPanel",
      width: 325,
      height: 175,
      pos: vec(450, 400),
      z: 10,
      tabHeight: 35,
      tabMinWidth: 80,
      tabPosition: "top", // Can be 'top', 'bottom', 'left', or 'right'
      colors: {
        backgroundStarting: Color.fromHex("#cacaca"),
        backgroundEnding: Color.fromHex("#636363"),
        borderColor: Color.fromHex("#0a0299"),
      },
      borderWidth: 2,
      panelRadius: 12,
      tabColors: {
        activeBackground: Color.fromHex("#0a0299"),
        inactiveBackground: Color.fromHex("#cacaca"),
        hoverBackground: Color.fromHex("#5d40f2"),
        activeText: Color.fromHex("#ebebeb"),
        inactiveText: Color.fromHex("#626262"),
        borderColor: Color.fromHex("#444444"),
        hoveredText: Color.fromHex("#ebebeb"),
      },
    });

    // Add tabs
    this.tabbedPanel.addTab(
      {
        id: "tab1",
        label: "Dashboard",
        closeable: false,
      },
      true,
    ); // Make active

    this.tabbedPanel.addTab({
      id: "tab2",
      label: "Settings",
      closeable: false,
    });

    this.tabbedPanel.addTab({
      id: "tab3",
      label: "Profile",
      closeable: false,
    });

    // Add content to tabs
    this.addContentToTab("tab1", this.createDashboardContent());
    this.addContentToTab("tab2", this.createSettingsContent());
    this.addContentToTab("tab3", this.createProfileContent());

    // Listen to tab events
    this.tabbedPanel.tabbedEmitter.on("TabChanged", evt => {
      console.log(`Tab changed to: ${evt.tabId}`);
    });

    this.tabbedPanel.tabbedEmitter.on("TabAdded", evt => {
      console.log(`Tab added: ${evt.tabId}`);
    });

    this.tabbedPanel.tabbedEmitter.on("TabRemoved", evt => {
      console.log(`Tab removed: ${evt.tabId}`);
    });

    // Add to engine
    this.engine.add(this.tabbedPanel);
  }

  private addContentToTab(tabId: string, content: (ScreenElement | Actor)[]): void {
    if (!this.tabbedPanel) return;

    const tabContent = this.tabbedPanel.getTabContent(tabId);
    if (!tabContent) return;

    const isActive = this.tabbedPanel.getActiveTabId() === tabId;

    content.forEach((element: ScreenElement | Actor) => {
      tabContent.addChild(element);

      // 👇 force child visibility to match tab state
      element.graphics.isVisible = isActive;
    });
  }

  private createDashboardContent(): (ScreenElement | Actor)[] {
    const title = new Label({
      text: "Dashboard",
      width: 150,
      pos: vec(20, 20),
      font: new Font({
        family: "sans-serif",
        size: 24,
        unit: FontUnit.Px,
        color: Color.fromHex("#333333"),
      }),
    });

    const description = new Label({
      text: `Welcome to the dashboard! This is tab 
1 content.`,
      pos: vec(20, 60),
      width: 100,
      font: new Font({
        family: "sans-serif",
        size: 14,
        unit: FontUnit.Px,
        color: Color.fromHex("#666666"),
      }),
    });

    return [title, description];
  }

  private createSettingsContent(): (ScreenElement | Actor)[] {
    const title = new Label({
      text: "Settings",
      pos: vec(20, 20),
      font: new Font({
        family: "sans-serif",
        size: 24,
        unit: FontUnit.Px,
        color: Color.fromHex("#333333"),
      }),
    });

    const description = new Label({
      text: `Configure your settings here. `,
      pos: vec(20, 60),
      font: new Font({
        family: "sans-serif",
        size: 14,
        unit: FontUnit.Px,
        color: Color.fromHex("#666666"),
      }),
    });

    return [title, description];
  }

  private createProfileContent(): (ScreenElement | Actor)[] {
    const title = new Label({
      text: "Profile",
      pos: vec(20, 20),
      font: new Font({
        family: "sans-serif",
        size: 24,
        unit: FontUnit.Px,
        color: Color.fromHex("#333333"),
      }),
    });

    const description = new Label({
      text: "View and edit your profile information.",
      pos: vec(20, 60),
      font: new Font({
        family: "sans-serif",
        size: 14,
        unit: FontUnit.Px,
        color: Color.fromHex("#666666"),
      }),
    });

    return [title, description];
  }

  // Dynamic tab management examples
  public addNewTab(id: string, label: string): void {
    if (!this.tabbedPanel) return;
    this.tabbedPanel.addTab(
      {
        id: id,
        label: label,
        closeable: true,
      },
      true,
    ); // Make the new tab active
  }

  public removeTab(id: string): void {
    if (!this.tabbedPanel) return;
    this.tabbedPanel.removeTab(id);
  }

  public switchToTab(id: string): void {
    if (!this.tabbedPanel) return;
    this.tabbedPanel.setActiveTab(id);
  }

  public getActiveTab(): string | null {
    if (!this.tabbedPanel) return null;
    return this.tabbedPanel.getActiveTabId();
  }
}

// Usage in your game
export function initializeTabbedPanelDemo(engine: Engine): TabbedPanelExample {
  return new TabbedPanelExample(engine);
}
