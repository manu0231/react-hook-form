import React from 'react'
import PropTypes from 'prop-types'
import { Controller } from 'react-hook-form'
import styled from 'styled-components'

const inputStyles = `
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    color: #212529;
    background-color: #fff;
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }
`

const StyledInput = styled.input`
  ${inputStyles}
`

const StyledTextarea = styled.textarea`
  ${inputStyles}
  height: auto;
`

const StyledSelect = styled.select`
  ${inputStyles}
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
  padding-right: 2.25rem;
`

const ErrorMessage = styled.div`
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
`

export const InputField = ({ name, type, control, errors, ...rest }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <>
        <StyledInput {...field} type={type} id={name} {...rest} />
        {errors?.[name] && <ErrorMessage>{errors[name].message}</ErrorMessage>}
      </>
    )}
  />
)

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object,
}

export const TextareaField = ({ name, control, errors, ...rest }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <>
        <StyledTextarea {...field} id={name} {...rest} />
        {errors?.[name] && <ErrorMessage>{errors[name].message}</ErrorMessage>}
      </>
    )}
  />
)

TextareaField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object,
}

export const RadioField = ({ name, options, control, errors, ...rest }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <>
        {options.map((option) => (
          <div key={option.value}>
            <input
              {...field}
              type="radio"
              id={`${name}-${option.value}`}
              value={option.value}
              checked={field.value === option.value}
              {...rest}
            />
            {option.label}
          </div>
        ))}
        {errors?.[name] && <ErrorMessage>{errors[name].message}</ErrorMessage>}
      </>
    )}
  />
)

RadioField.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object,
}

export const CheckboxField = ({ name, control, errors, ...rest }) => (
  <Controller
    name={name}
    control={control}
    defaultValue={false}
    render={({ field }) => (
      <div>
        <input
          {...field}
          type="checkbox"
          id={name}
          checked={field.value || false}
          {...rest}
        />
        {errors?.[name] && <ErrorMessage>{errors[name].message}</ErrorMessage>}
      </div>
    )}
  />
)

CheckboxField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object,
}

export const SelectField = ({
  name,
  options,
  control,
  errors,
  setValue,
  formResponse,
  optionLabelKey,
  ...rest
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <>
        <StyledSelect
          {...field}
          id={name}
          {...rest}
          onChange={(e) => {
            const selectedValue = Number(e.target.value)
            field.onChange(selectedValue)
            const response = formResponse?.find(
              (data) => data.id === selectedValue
            )
            setValue(optionLabelKey, response)
          }}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledSelect>
        {errors?.[name] && <ErrorMessage>{errors[name].message}</ErrorMessage>}
      </>
    )}
  />
)

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object,
  setValue: PropTypes.func.isRequired,
  formResponse: PropTypes.array.isRequired,
  optionLabelKey: PropTypes.string,
}
