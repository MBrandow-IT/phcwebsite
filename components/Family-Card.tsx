import React from 'react'

interface FamilyCardProps {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthdate?: Date;
  gender: string;
  headOfHousehold: boolean;
  swimmingAbility?: string;
  allergies?: string;
  medication?: string;
  photoRelease: boolean;
}

const FamilyCard = ({
  firstName, 
  lastName,
  email,
  phone,
  gender,
  headOfHousehold,
  photoRelease,
  allergies,
  medication,
  swimmingAbility
}: FamilyCardProps) => {
  return (
    <div className='w-full h-full border shadow-md p-8 rounded-lg'>
      {firstName} {lastName}
    </div>
  )
}

export default FamilyCard