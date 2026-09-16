import { Check, ChevronDown } from "lucide-react";
import {
  useImperativeHandle,
  useRef,
  type AriaAttributes,
  type ComponentRef,
  type FocusEventHandler,
  type Ref,
} from "react";
import { AntSelect } from "../internal/antd.js";
import { cx } from "../types.js";
import type { SelectOption } from "./forms.js";
import styles from "./dropdown-select.module.css";

export interface DropdownSelectHandle {
  focus: () => void;
  blur: () => void;
}

export interface DropdownSelectProps<Value extends string> extends AriaAttributes {
  readonly className?: string;
  readonly disabled?: boolean;
  readonly id?: string;
  readonly name?: string;
  readonly onBlur?: FocusEventHandler<HTMLElement>;
  readonly onFocus?: FocusEventHandler<HTMLElement>;
  readonly onValueChange: (value: Value) => void;
  readonly options: ReadonlyArray<SelectOption<Value>>;
  readonly placeholder?: string;
  readonly placement?: "top" | "bottom";
  readonly ref?: Ref<DropdownSelectHandle>;
  readonly value: Value;
}

/** A controlled single-choice dropdown with PADS styling and keyboard navigation. */
export function DropdownSelect<Value extends string>({
  className,
  disabled = false,
  name,
  onValueChange,
  options,
  placement = "bottom",
  ref,
  value,
  ...attributes
}: DropdownSelectProps<Value>) {
  const control = useRef<ComponentRef<typeof AntSelect>>(null);
  useImperativeHandle(
    ref,
    () => ({
      focus: () => control.current?.focus(),
      blur: () => control.current?.blur(),
    }),
    [],
  );

  return (
    <div className={styles.container}>
      <AntSelect<Value>
        {...attributes}
        ref={control}
        classNames={{
          root: cx(styles.root, className),
          input: cx(styles.input),
          content: cx(styles.content),
          popup: { root: cx(styles.popup), listItem: cx(styles.listItem) },
        }}
        disabled={disabled}
        getPopupContainer={(trigger: HTMLElement) => trigger.parentElement ?? trigger}
        options={options.map((option) => ({ ...option }))}
        placement={placement === "top" ? "topLeft" : "bottomLeft"}
        showSearch={false}
        transitionName=""
        virtual={false}
        value={value}
        suffixIcon={<ChevronDown aria-hidden size={16} />}
        optionRender={(option) => (
          <span className={styles.option}>
            <span>{option.label}</span>
            {option.value === value && <Check aria-hidden size={16} />}
          </span>
        )}
        onChange={onValueChange}
      />
      {name && <input disabled={disabled} name={name} type="hidden" value={value} />}
    </div>
  );
}
