import type React from "react"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

export default function FormInput({ label, error, ...rest }: Props) {
  return (
    <label className="field">
      <span className="label">{label}</span>
      <input className={`input ${error ? "input-error" : ""}`} {...rest} />
      {error ? <span className="error">{error}</span> : null}
    </label>
  )
}
