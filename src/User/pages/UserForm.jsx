import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import {
  InputField,
  TextareaField,
  SelectField,
  RadioField,
} from '../components/FormComponent'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery } from '@tanstack/react-query'

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 200px;
  margin: 0 auto;
`

const SubmitButton = styled.button`
  background-color: #0d6efd;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0b5ed7;
  }

  &:disabled {
    background-color: #ced4da;
    color: #6c757d;
    cursor: not-allowed;
  }
`

const schema = yup.object().shape({
  address: yup.string().required('Address is required'),
  description: yup.string().required('Description is required'),
  selectOption: yup.mixed().required('Please select an option.'),
})

const fetchUser = async () => {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon/')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  })
}

const addressObject = {
  pokemonFan: 'true',
  address: 'asd',
  description: 'adsf',
  pokemon: {
    id: '',
    name: '',
    url: '',
  },
}

const UserForm = () => {
  const { data: response, error, isLoading } = useUser()
  const [formResponse, setFormResponse] = useState([])

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: addressObject,
    mode: 'onChange',
  })

  const onSubmit = (data) => {
    console.log(data)
  }

  useEffect(() => {
    if (response) {
      const newResponse = response.results.map((pokemon, index) => {
        return { id: index + 1, name: pokemon.name, url: pokemon.url }
      })
      setFormResponse(newResponse)
    }
  }, [response, reset])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const generateOptions = (data, fieldName) => {
    return (
      data?.map((item, index) => ({
        value: item.id || index + 1,
        label: item[fieldName],
      })) || []
    )
  }

  const selectOptions = generateOptions(response?.results, 'name')

  const radioOptions = [
    { value: 'true', label: 'Yes I am pokemon fan' },
    { value: 'false', label: `I don't like pokemon` },
  ]

  const radioValue = watch('pokemonFan')

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <RadioField
        name="pokemonFan"
        control={control}
        errors={errors}
        options={radioOptions}
      />

      <InputField
        name="address"
        control={control}
        type="text"
        errors={errors}
        placeholder="Enter address"
      />
      <TextareaField
        name="description"
        control={control}
        errors={errors}
        placeholder="Enter description"
      />
      <SelectField
        name="selectOption"
        control={control}
        options={selectOptions}
        errors={errors}
        setValue={setValue}
        formResponse={formResponse}
        optionLabelKey="pokemon"
      />
      <SubmitButton type="submit" disabled={radioValue !== 'true'}>
        Submit
      </SubmitButton>
    </FormContainer>
  )
}

export default UserForm
