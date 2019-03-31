import React, { Component } from 'react'
import EmptyClassroomTable from '../components/p_emptyClassroom/EmptyClassroomTable'
import Header from '../components/common/Header'
import fetch from 'isomorphic-unfetch'

class Index extends Component {
  static async getInitialProps() {
    let res
    try {
      res = await fetch('http://localhost:1338/api/emptyClassroom')
      res = await res.json()
    } catch (e) {
      console.log(e)
    }
    return {
      data: res
    }
  }
  constructor(props) {
    super(props)
  }
  render() {
    const { afternoonItems = [], nightItems = []} = this.props.data
    return (
      <>
        <Header/>
        <EmptyClassroomTable afternoonItems={afternoonItems} nightItems={nightItems} />
      </>
    )
  }
}

export default Index
