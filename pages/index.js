import React from 'react'
import EmptyClassroomTable from '../components/p_emptyClassroom/EmptyClassroomTable'
import Header from '../components/common/Header'

const Index = (props) => {
  const { afternoonItems, nightItems } = props.url.query
  return (
    <>
      <Header/>
      <EmptyClassroomTable afternoonItems={afternoonItems} nightItems={nightItems} />
    </>
  )
}
export default Index
