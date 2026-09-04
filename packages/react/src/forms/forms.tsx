import { Search, UploadCloud } from "lucide-react";
import {
  cloneElement,
  forwardRef,
  useId,
  useRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cx } from "../types.js";
import styles from "./forms.module.css";

export interface FieldProps {
  readonly children: ReactElement<{
    readonly "aria-describedby"?: string;
    readonly "aria-invalid"?: boolean | "false" | "grammar" | "spelling" | "true";
    readonly "aria-required"?: boolean | "false" | "true";
  }>;
  readonly className?: string;
  readonly description?: string;
  readonly error?: string;
  readonly htmlFor: string;
  readonly label: string;
  readonly required?: boolean;
}

export function Field({
  children,
  className,
  description,
  error,
  htmlFor,
  label,
  required,
}: FieldProps) {
  const descriptionId = `${htmlFor}-description`;
  const errorId = `${htmlFor}-error`;
  const describedBy = Array.from(
    new Set(
      [
        children.props["aria-describedby"],
        description && !error ? descriptionId : undefined,
        error ? errorId : undefined,
      ].filter((id): id is string => Boolean(id)),
    ),
  ).join(" ");
  const control = cloneElement(children, {
    ...(describedBy ? { "aria-describedby": describedBy } : {}),
    ...(error ? { "aria-invalid": true } : {}),
    ...(required ? { "aria-required": true } : {}),
  });

  return (
    <div className={cx(styles.field, className)}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      {control}
      {description && !error && (
        <span className={styles.description} id={descriptionId}>
          {description}
        </span>
      )}
      {error && (
        <span className={styles.message} data-tone="error" id={errorId} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cx(styles.input, className)} {...props} />;
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cx(styles.textarea, className)} {...props} />;
});

export interface SelectOption<Value extends string = string> {
  readonly disabled?: boolean;
  readonly label: string;
  readonly value: Value;
}

export interface SelectProps<Value extends string> extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "onChange" | "value"
> {
  readonly onValueChange: (value: Value) => void;
  readonly options: ReadonlyArray<SelectOption<Value>>;
  readonly value: Value;
}

export function Select<Value extends string>({
  className,
  onValueChange,
  options,
  value,
  ...props
}: SelectProps<Value>) {
  return (
    <select
      className={cx(styles.select, className)}
      value={value}
      onChange={(event) => onValueChange(event.target.value as Value)}
      {...props}
    >
      {options.map((option) => (
        <option disabled={option.disabled} key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export const SearchInput = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "type">
>(function SearchInput({ className, ...props }, ref) {
  return (
    <div className={styles.controlWrap}>
      <Search aria-hidden className={styles.controlIcon} size={16} />
      <input
        ref={ref}
        className={cx(styles.input, styles.withIcon, className)}
        type="search"
        {...props}
      />
    </div>
  );
});

export function Checkbox({
  children,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { readonly children: ReactNode }) {
  return (
    <label className={cx(styles.choice, className)}>
      <input type="checkbox" {...props} />
      <span>{children}</span>
    </label>
  );
}

export interface RadioOption<Value extends string> {
  readonly disabled?: boolean;
  readonly label: ReactNode;
  readonly value: Value;
}

export function RadioGroup<Value extends string>({
  className,
  disabled,
  legend,
  name,
  onValueChange,
  options,
  value,
}: {
  readonly className?: string;
  readonly disabled?: boolean;
  readonly legend: string;
  readonly name: string;
  readonly onValueChange: (value: Value) => void;
  readonly options: ReadonlyArray<RadioOption<Value>>;
  readonly value: Value;
}) {
  return (
    <fieldset className={cx(styles.choiceGroup, className)} disabled={disabled}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.choiceItems}>
        {options.map((option) => (
          <label className={styles.choice} key={option.value}>
            <input
              checked={option.value === value}
              disabled={option.disabled}
              name={name}
              type="radio"
              value={option.value}
              onChange={() => onValueChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Switch({
  checked,
  className,
  disabled,
  label,
  onCheckedChange,
}: {
  readonly checked: boolean;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly label: string;
  readonly onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className={cx(styles.switchLabel, className)}>
      <button
        aria-checked={checked}
        aria-label={label}
        className={styles.switch}
        disabled={disabled}
        role="switch"
        type="button"
        onClick={() => onCheckedChange(!checked)}
      />
      <span>{label}</span>
    </label>
  );
}

export function SegmentedControl<Value extends string>({
  label,
  onValueChange,
  options,
  value,
}: {
  readonly label: string;
  readonly onValueChange: (value: Value) => void;
  readonly options: ReadonlyArray<SelectOption<Value>>;
  readonly value: Value;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const move = (from: number, direction: 1 | -1) => {
    let next = from;
    for (let count = 0; count < options.length; count += 1) {
      next = (next + direction + options.length) % options.length;
      const option = options[next];
      if (option && !option.disabled) {
        onValueChange(option.value);
        refs.current[next]?.focus();
        return;
      }
    }
  };
  return (
    <div aria-label={label} className={styles.segmented} role="radiogroup">
      {options.map((option, index) => (
        <button
          ref={(node) => {
            refs.current[index] = node;
          }}
          aria-checked={option.value === value}
          className={styles.segment}
          disabled={option.disabled}
          key={option.value}
          role="radio"
          tabIndex={index === selectedIndex ? 0 : -1}
          type="button"
          onClick={() => onValueChange(option.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
              event.preventDefault();
              move(index, 1);
            } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
              event.preventDefault();
              move(index, -1);
            }
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function FileDropzone({
  accept,
  description,
  disabled,
  label,
  multiple,
  onFiles,
}: {
  readonly accept?: string;
  readonly description?: string;
  readonly disabled?: boolean;
  readonly label: string;
  readonly multiple?: boolean;
  readonly onFiles: (files: ReadonlyArray<File>) => void;
}) {
  const id = useId();
  const change = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) onFiles(Array.from(event.target.files));
    event.target.value = "";
  };
  return (
    <label className={styles.dropzone} htmlFor={id}>
      <UploadCloud aria-hidden size={24} />
      <span className={styles.dropzoneTitle}>{label}</span>
      {description && <span className={styles.description}>{description}</span>}
      <input
        accept={accept}
        disabled={disabled}
        id={id}
        multiple={multiple}
        type="file"
        onChange={change}
      />
    </label>
  );
}

export const Slider = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "type">
>(function Slider({ className, ...props }, ref) {
  return (
    <input ref={ref} className={cx(styles.slider, className)} type="range" {...props} />
  );
});
