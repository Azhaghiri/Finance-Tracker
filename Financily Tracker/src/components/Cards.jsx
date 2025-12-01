import React from 'react'
import './styles.css'
import {Card, Row} from "antd"

const Cards = ({income,expense,totalBalance,showExpenseModalVisible,showIncomeModalVisible}) => {
  return (
    <div>
      <Row className='myrow'>
        <Card className='mycard' title='Current Balance'>
            <p>₹ {totalBalance}</p>
            <button className='btn-blue'>Reset Balance</button>
        </Card>
        <Card className='mycard' title='Total Income'>
            <p>₹ {income}</p>
            <button className='btn' onClick={showIncomeModalVisible}>Add Income</button>
        </Card>
        <Card className='mycard' title='Total Expense'>
            <p>₹ {expense}</p>
            <button className='btn' onClick={showExpenseModalVisible}>Add Expense</button>
        </Card>
      </Row>
    </div>
  )
}

export default Cards
