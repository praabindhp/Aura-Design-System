# DropdownSelect

`DropdownSelect` is a controlled, single-choice form primitive for settings,
appearance, and other compact option lists. Its anatomy is a labelled control,
current value, chevron, option list, and selected checkmark. Use short, distinct
option labels and a visible `Field` label. Keep product authorization and data
loading in the consumer; disable unavailable options and explain why nearby.

```tsx
<Field htmlFor="visibility" label="Visibility">
  <DropdownSelect
    id="visibility"
    name="visibility"
    options={[
      { value: "private", label: "Only me" },
      { value: "team", label: "My team" },
    ]}
    value={visibility}
    onValueChange={setVisibility}
  />
</Field>
```

Import `DropdownSelect`, `DropdownSelectProps`, and `DropdownSelectHandle` from
the public React package entry point. `value`, `options`, and `onValueChange` are
required and share a string value type. Optional props are `id`, `name`,
`disabled`, `placeholder`, `className`, `placement` (`bottom` or `top`),
`onFocus`, `onBlur`, standard ARIA attributes, and `ref`. The ref exposes only
`focus()` and `blur()`. A supplied `name` submits the selected value through a
hidden native input; disabled controls do not submit. Validation remains
consumer-owned; use `Field.error` and `aria-invalid` for errors.

Tab focuses the control. Arrow keys open and navigate the list, Enter selects,
Escape dismisses without changing the value, and Tab moves onward. Selection is
announced through the option semantics and shown with a checkmark. Every option
is available to assistive technology; the list is not virtualized. Disabled
controls and options cannot be selected. Popup styling inherits the active PADS
theme and brand. Touch targets, forced colors, and reduced motion follow the
shared provider contract. Focus uses one inset boundary, without a second halo.

Use this component for a compact, styled single choice. Do not use it as a
command menu, multiselect, searchable large dataset, or a substitute for a visible
label. The existing native `Select` remains available for browser-native menus
and native form behavior. No migration is required; replacing `Select` with
`DropdownSelect` is opt-in and uses the same controlled value/options callback
model, with the smaller documented prop surface above.

The colocated `Forms/Styled dropdowns` stories show normal, selected, disabled,
and validation states, alongside the single-boundary text controls. Review them
with Storybook's brand, theme, and viewport controls. The showcase uses the same
primitive for brand, theme, and CharterAura mode choices.
