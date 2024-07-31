import FamilyCard from '@/components/Family-Card'
import React from 'react'

const Family = () => {
  const contacts = [
    {
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "JDoe@gmail.com",
      "phone": "123-456-7890",
      "gender": "female",
      "headOfHousehold": true,
      "photoRelease": true,
    }, {
      "firstName": "John",
      "lastName": "Doe",
      "gender": "male",
      "headOfHousehold": false,
      "swimmingAbility": "poor",
      "allergies": "Itchy Grass",
      "medication": "Has bad headaches",
      "photoRelease": true,
    }
  ]
  

  return (
    <div className='p-16 gap-4 flex flex-col flex-wrap items-center w-full'>
      <h1 className=' font-bold text-xl'>Parent/Guardians</h1>
      {contacts.map((contact, i) => {
        const headOfHouseHold = contact.headOfHousehold
        if (headOfHouseHold === true) return (
        <div key={i}>
          <FamilyCard 
            firstName={contact.firstName}
            lastName={contact.lastName}
            email={contact.email}
            phone={contact.phone}
            gender={contact.gender}
            headOfHousehold={contact.headOfHousehold}
            allergies={contact.allergies}
            photoRelease={contact.photoRelease}
          />
        </div>
        )
      })}
      <h1 className=' font-bold text-xl'>Camper</h1>
      {contacts.map((contact, i) => {
        const headOfHouseHold = contact.headOfHousehold
        if (headOfHouseHold === false) return (
        <div key={i}>
          <FamilyCard 
            firstName={contact.firstName}
            lastName={contact.lastName}
            email={contact.email}
            phone={contact.phone}
            gender={contact.gender}
            headOfHousehold={contact.headOfHousehold}
            allergies={contact.allergies}
            photoRelease={contact.photoRelease}
          />
        </div>
        )
      })}
    </div>
  )
}

export default Family