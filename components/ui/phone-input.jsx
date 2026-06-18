"use client";

import { PhoneInput as IntlPhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { cn } from "@/lib/utils";

export function PhoneInput({ value, onChange, className, defaultCountry = "in", invalid }) {
  return (
    <div className={cn("galassia-phone-input", invalid && "is-invalid", className)}>
      <IntlPhoneInput
        defaultCountry={defaultCountry}
        value={value}
        onChange={(phone) => onChange?.(phone)}
        inputProps={{ "aria-invalid": invalid || undefined }}
        countrySelectorStyleProps={{
          buttonClassName: "galassia-phone-input__country-btn",
          dropdownStyleProps: {
            className: "galassia-phone-input__dropdown",
            listItemClassName: "galassia-phone-input__dropdown-item",
          },
        }}
        inputClassName="galassia-phone-input__input"
        className="galassia-phone-input__wrap"
      />
    </div>
  );
}
