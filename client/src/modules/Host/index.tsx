import {
  // BankOutlined,
  // HomeOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useMutation } from '@apollo/client'
import {
  Layout,
  Typography,
  Form,
  Input,
  InputNumber,
  // Radio,
  Upload,
  Button,
} from 'antd'

import { UploadChangeParam } from 'antd/lib/upload'
import { useEffect, useRef, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { ListingType } from '../../lib/graphql/globalTypes'
import { HOST_LISTING } from '../../lib/graphql/mutations'
import {
  HostListing as HostListingData,
  HostListingVariables,
} from '../../lib/graphql/mutations/HostListing/__generated__/HostListing'
import { useScrollToTop } from '../../lib/hooks'
import { Viewer } from '../../lib/types'
import {
  displayErrorMessage,
  displaySuccessNotification,
} from '../../lib/utils'

const { Content } = Layout
const { Text, Title } = Typography

const { Item } = Form

interface Props {
  viewer: Viewer
}

export const Host = ({ viewer }: Props) => {
  useScrollToTop()

  useEffect(() => {}, [viewer])

  const [form] = Form.useForm()

  const formRef = useRef(form)

  const [imageLoading, setImageLoading] = useState(false)
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null)

  const [hostListing, { loading, data, error }] = useMutation<
    HostListingData,
    HostListingVariables
  >(HOST_LISTING, {
    onCompleted: () => {
      displaySuccessNotification("You've successfully created your listing!")
    },
    onError: () => {
      displayErrorMessage(
        `${error}: Sorry! We could not create your listing. Please try again later.`
      )
    },
  })

  const handleImageUpload = (info: UploadChangeParam) => {
    const { file } = info

    if (file.status === 'uploading') {
      setImageLoading(true)
      return
    }
    if (file.status === 'done' && file.originFileObj) {
      getBase64Value(file.originFileObj, (imageBase64Value) => {
        setImageBase64Value(imageBase64Value)
        setImageLoading(false)
      })
    }
  }

  useEffect(() => {
    formRef.current.setFieldsValue({
      name: 'host_form',
    })
  }, [])

  // const onChange = (e: any) => {
  //   console.log(e.target.value)
  // }

  const onFinish = async (values: any) => {
    const randomListingType = async () => {
      if (Math.random() > 5) {
        values.type = ListingType.APARTMENT
      } else {
        values.type = ListingType.HOUSE
      }
    }
    randomListingType()

    const fullAddress = `${values.address}, ${values.city}, ${values.state}, ${values.postalCode}`

    const input = {
      ...values,
      address: fullAddress,
      image: imageBase64Value,
    }
    delete input.city
    delete input.postalCode
    delete input.state

    hostListing({
      variables: { input },
    })
  }

  if (loading) {
    return (
      <Content className='host-content'>
        <div className='host__form-header'>
          <Title level={3} className='host__form-title'>
            Please wait 🙂
          </Title>
          <Text type='secondary'>We are creating your listing now!</Text>
        </div>
      </Content>
    )
  }

  if (data && data.hostListing) {
    return <Redirect to={`/listing/${data.hostListing.id}`} />
  }

  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Content className='host-content'>
        <div className='host__form-header'>
          <Title level={4} className='host__form-title'>
            You have to be signed in and connected with Stripe to host a
            listing!
          </Title>
          <Text type='secondary'>
            We only allow users who have signed in to our platform and have
            connected with stripe to host new listings. You can sign in at the{' '}
            <Link to='/login'>login</Link> page and connect with stripe shortly
            after!
          </Text>
        </div>
      </Content>
    )
  }

  return (
    <Content className='host-content'>
      <Form
        name='host_form'
        layout='vertical'
        form={formRef.current}
        onFinish={onFinish}>
        <div className='host__form-header'>
          <Title level={3} className='host__form-title'>
            Let's get started listing your place!
          </Title>
          <Text type='secondary'>
            In this form, we will collect some basic and additional information
            about your listing.
          </Text>
        </div>

        {/* <Item
          label='Home Type'
          name='listingType'
          rules={[{ required: true, message: 'Please select a home type!' }]}>
          <Radio.Group defaultValue={ListingType.APARTMENT} onChange={onChange}>
            <Radio.Button checked value={ListingType.APARTMENT}>
              <BankOutlined /> Apartment
            </Radio.Button>
          </Radio.Group>
          <Radio.Group>
            <Radio.Button value={ListingType.HOUSE}>
              <HomeOutlined /> House
            </Radio.Button>
          </Radio.Group>
        </Item> */}

        <Item
          label='Title'
          extra='Max Character count of 50'
          name='title'
          rules={[
            {
              required: true,
              message: 'Please enter a title for your listing!',
            },
          ]}>
          <Input
            maxLength={50}
            placeholder='The Iconic and luxurious mansion'
          />
        </Item>

        <Item
          label='Description'
          extra='Max Character count of 400'
          name='description'
          rules={[
            {
              required: true,
              message: 'Please enter a description for your listing!',
            },
          ]}>
          <Input.TextArea
            rows={3}
            maxLength={400}
            placeholder='Our rooms have ample sunlight throughout the day, making your stay and work enjoyable while always being connected with the outdoors.'
          />
        </Item>

        <Item
          label='Max # of guests'
          name='numOfGuests'
          rules={[
            {
              required: true,
              message: 'Please enter the maximum number of guests!',
            },
          ]}>
          <InputNumber min={1} placeholder='4' />
        </Item>

        <Item
          label='Address'
          name='address'
          rules={[
            {
              required: true,
              message: 'Please enter the address for your listing!',
            },
          ]}>
          <Input placeholder='Lahaul,North Himachal' />
        </Item>

        <Item
          label='City/Town'
          name='city'
          rules={[
            {
              required: true,
              message: 'Please enter the city (or town) for your listing!',
            },
          ]}>
          <Input placeholder='Manali' />
        </Item>

        <Item
          label='State/Province'
          name='state'
          rules={[
            {
              required: true,
              message: 'Please enter the state for your listing!',
            },
          ]}>
          <Input placeholder='Himachal Pradesh' />
        </Item>

        <Item
          label='Zip/Postal Code'
          name='postalCode'
          rules={[
            {
              required: true,
              message: 'Please enter the zip code for your listing!',
            },
          ]}>
          <Input placeholder='Please enter a zip code for your listing!' />
        </Item>

        <Item
          label='Image'
          extra='Images have to be under 1 MB in size and of format JPG/PNG/WEBP'
          name='image'
          rules={[
            {
              required: true,
              message: 'Please upload the image for your listing!',
            },
          ]}>
          <div className='host__form-image-upload'>
            <Upload
              name='image'
              listType='picture-card'
              showUploadList={false}
              customRequest={dummyRequest}
              beforeUpload={beforeImageUpload}
              onChange={handleImageUpload}>
              {imageBase64Value ? (
                <img src={imageBase64Value} alt='Listing' />
              ) : (
                <div>
                  {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div className='ant-upload-text'>Upload</div>
                </div>
              )}
            </Upload>
          </div>
        </Item>

        <Item
          label='Price'
          extra='All prices are in ₹ INR/day'
          name='price'
          rules={[
            {
              required: true,
              message: 'Please enter the price for your listing!',
            },
          ]}>
          <InputNumber min={0} placeholder='100' />
        </Item>

        <Item>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Item>
      </Form>
    </Content>
  )
}

const beforeImageUpload = (file: File) => {
  const fileIsValidImage =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/webp'
  const fileIsValidSize = file.size / 1024 / 1024 < 1

  if (!fileIsValidImage) {
    displayErrorMessage(
      'You are only able to upload valid file sizes JPG/PNG/WEBP !'
    )
    return false
  }

  if (!fileIsValidSize) {
    displayErrorMessage(
      'You are only able to upload files of under 1 MB in size!'
    )
    return false
  }

  return fileIsValidImage && fileIsValidSize
}

const getBase64Value = (
  img: File | Blob,
  callback: (imageBase64Value: string) => void
) => {
  const reader = new FileReader()
  reader.readAsDataURL(img)
  reader.onload = () => {
    callback(reader.result as string)
  }
}

const dummyRequest = (option: any) => {
  setTimeout(() => {
    option.onSuccess('ok')
  }, 0)
}
