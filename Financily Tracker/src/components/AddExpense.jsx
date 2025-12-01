import React from 'react'
import { Button,Modal,Form,Input,DatePicker,Select } from 'antd'

const AddExpense = ({
    isExpenseModalVisible,
    handleExpenseCancel,
    onFinish,
}) => {

    const [form] = Form.useForm();
  return (
    <div>
      <Modal 
      style={{fontWeight:600,width:'200px'}}
      title="Add Expense"
      open={isExpenseModalVisible}
      onCancel={handleExpenseCancel}
      footer={null}
      >

        <Form
        form={form}
        layout='vertical'
        onFinish={(values) => {
            onFinish(values,'expense');
            form.resetFields();
        }}
        >
        <Form.Item 
        style={{fontWeight:600}}
        label='Name'
        name='name'
        rules={[{required:true,message:'Please Input the Name of the transavtion'}]}
        >
            <Input type='text' className='custominput'/>
        </Form.Item>

        <Form.Item 
        style={{fontWeight:600}}
        label='Amount'
        name='amount'
        rules={[{required:true,message:'Please Input the expense amount'}]}
        >
            <Input type='number' className='custominput'/>
        </Form.Item>

        <Form.Item 
        style={{fontWeight:600}}
        label='Date'
        name='date'
        rules={[{required:true,message:'Please Input the expense date'}]}
        >
            <DatePicker className='customeinput' format='YYYY-MM-DD'/>
        </Form.Item>

        <Form.Item 
        style={{fontWeight:600}}
        label='Tag'
        name='tag'
        rules={[{required:true,message:'Please select a tag'}]}
        >
           <Select className='selectinput'>
                <Select.Option value='onlineshoping'>Online Shoping</Select.Option>
                <Select.Option value='outing'>Outing</Select.Option>
                <Select.Option value='snacks'>Snacks</Select.Option>
                <Select.Option value='general'>Geleral Expense</Select.Option>
           </Select>
        </Form.Item>

        <Form.Item>
            <Button className='btn btn-blue' htmlType='submit'>
                Add Expense
            </Button>
        </Form.Item>
        </Form>
        
      </Modal>
    </div>
  )
}

export default AddExpense
