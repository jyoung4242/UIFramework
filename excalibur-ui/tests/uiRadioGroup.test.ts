import { describe, it, expect, vi, beforeEach } from "vitest";
import { EventEmitter } from "excalibur";
import { UIRadioGroup } from "../Components/uiRadioGroup";

/**
 * Minimal mock checkbox that behaves like UICheckbox / UISpriteCheckbox
 */
class MockCheckbox {
  checked = false;
  enabled = true;

  emitter = new EventEmitter<{
    UICheckboxChanged: { checked: boolean };
  }>();

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  toggle(value: boolean) {
    this.checked = value;
    this.emitter.emit("UICheckboxChanged", { checked: value });
  }
}

describe("UIRadioGroup", () => {
  let group: UIRadioGroup;
  let cb1: MockCheckbox;
  let cb2: MockCheckbox;
  let cb3: MockCheckbox;

  beforeEach(() => {
    group = new UIRadioGroup();
    cb1 = new MockCheckbox();
    cb2 = new MockCheckbox();
    cb3 = new MockCheckbox();
  });

  it("adds checkboxes to the group", () => {
    group.add(cb1 as any);
    group.add(cb2 as any);

    expect(group.count).toBe(2);
    expect(group.items).toContain(cb1);
    expect(group.items).toContain(cb2);
  });

  it("selects a checkbox when it is checked", () => {
    group.add(cb1 as any);
    group.add(cb2 as any);

    cb2.toggle(true);

    expect(group.selectedIndex).toBe(1);
    expect(group.selectedCheckbox).toBe(cb2);
    expect(cb1.checked).toBe(false);
    expect(cb2.checked).toBe(true);
  });

  it("deselects previous checkbox when a new one is selected", () => {
    group.add(cb1 as any);
    group.add(cb2 as any);

    cb1.toggle(true);
    cb2.toggle(true);

    expect(group.selectedIndex).toBe(1);
    expect(cb1.checked).toBe(false);
    expect(cb2.checked).toBe(true);
  });

  it("prevents deselection by default", () => {
    group.add(cb1 as any);

    cb1.toggle(true);
    cb1.toggle(false);

    expect(group.selectedIndex).toBe(0);
    expect(cb1.checked).toBe(true);
  });

  it("allows deselection when allowDeselect = true", () => {
    group = new UIRadioGroup({ allowDeselect: true });
    group.add(cb1 as any);

    cb1.toggle(true);
    cb1.toggle(false);

    expect(group.selectedIndex).toBe(-1);
    expect(group.selectedCheckbox).toBe(null);
    expect(cb1.checked).toBe(false);
  });

  it("respects initial selectedIndex", () => {
    group = new UIRadioGroup({ selectedIndex: 1 });

    group.add(cb1 as any);
    group.add(cb2 as any);

    expect(group.selectedIndex).toBe(1);
    expect(cb2.checked).toBe(true);
    expect(cb1.checked).toBe(false);
  });

  it("emits UIRadioGroupChanged when selection changes", () => {
    group.add(cb1 as any);
    group.add(cb2 as any);

    const spy = vi.fn();
    group.emitter.on("UIRadioGroupChanged", spy);

    cb1.toggle(true);

    expect(spy).toHaveBeenCalledWith({
      event: "changed",
      name: "UIRadioGroup",
      selectedIndex: 0,
      selectedCheckbox: cb1,
      previousIndex: -1,
      target: group,
    });
  });

  it("removes a checkbox", () => {
    group.add(cb1 as any);
    group.add(cb2 as any);

    group.remove(cb1 as any);

    expect(group.count).toBe(1);
    expect(group.items[0]).toBe(cb2);
  });

  it("adjusts selectedIndex when removing earlier checkbox", () => {
    group.add(cb1 as any);
    group.add(cb2 as any);
    group.add(cb3 as any);

    cb3.toggle(true); // index 2

    group.remove(cb1 as any); // now cb3 should be index 1

    expect(group.selectedIndex).toBe(1);
    expect(group.selectedCheckbox).toBe(cb3);
  });

  it("clears all checkboxes", () => {
    group.add(cb1 as any);
    group.add(cb2 as any);

    group.clear();

    expect(group.count).toBe(0);
    expect(group.selectedIndex).toBe(-1);
  });

  it("setEnabled forwards to all checkboxes", () => {
    group.add(cb1 as any);
    group.add(cb2 as any);

    group.setEnabled(false);

    expect(cb1.enabled).toBe(false);
    expect(cb2.enabled).toBe(false);
  });

  it("getCheckbox returns correct checkbox or null", () => {
    group.add(cb1 as any);
    group.add(cb2 as any);

    expect(group.getCheckbox(0)).toBe(cb1);
    expect(group.getCheckbox(1)).toBe(cb2);
    expect(group.getCheckbox(2)).toBe(null);
  });
});
