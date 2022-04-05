import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Button, DatePicker, PageHeader, Descriptions, Input, message, Radio } from 'antd';

import { withContextInitialized } from '../../components/hoc';
import CompanyCard from '../../components/molecules/CompanyCard';
import GenericList from '../../components/organisms/GenericList';
import OverlaySpinner from '../../components/molecules/OverlaySpinner';
import { usePersonInformation } from '../../components/hooks/usePersonInformation';

import { Company } from '../../constants/types';
import { ResponsiveListCard } from '../../constants';
import moment from 'moment';  

const PersonDetail = () => {
  const router = useRouter();
  const { load, loading, save, data } = usePersonInformation(
    router.query?.email as string,
    true
  );
  const [newData, setNewData] = useState({
    name: '',
    gender: '',
    phone: '',
    birthday: '',
  })
  
    useEffect(() => {
      load();
    }, []);

  useEffect(()=>{
    if(data){
      setNewData({
        name: data.name,
        gender: data.gender,
        phone: data.phone,
        birthday: data.birthday,
      })
    }
  }, [data])

  if (loading) {
    return <OverlaySpinner title={`Loading ${router.query?.email} information`} />;
  }

  if (!data) {
    message.error("The user doesn't exist redirecting back...", 2, () =>
      router.push('/home')
    );
    return <></>;
  }

  function onChangeFormData (varName){
    return e => save({
      ...data,
      [varName]: e.target.value
    })
  }

  function onChangeFormDate (varName){
    return (date, dataString) => save({
      ...data,
      [varName]: date
    })
  }

  return (
    <>
      <PageHeader
        onBack={router.back}
        title="Person"
        subTitle="Profile"
        extra={[
          <Button
            style={{ padding: 0, margin: 0 }}
            type="link"
            href={data.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit website
          </Button>,
          <Button type="default" onClick={() => {}}>
            Edit
          </Button>,
        ]}
      >
        {data && (
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="Name">
              <Input value={data.name} onChange={onChangeFormData('name')} /> 
            </Descriptions.Item>
            <Descriptions.Item label="Gender">
            <Radio.Group onChange={onChangeFormData('gender')} value={data.gender}>
              <Radio value={'male'}>Male</Radio>
              <Radio value={'female'}>Female</Radio>
              {/* <Radio value={'nonbinary'}>B</Radio> */}
            </Radio.Group>
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              <Input value={data.phone} onChange={onChangeFormData('phone')} />
            </Descriptions.Item>

            <Descriptions.Item label="Birthday">
              <DatePicker onChange={onChangeFormDate('birthday')} value={moment(data.birthday, 'YYYY-MM-DD')} />
            </Descriptions.Item>
          </Descriptions>
        )}
        <GenericList<Company>
          loading={loading}
          extra={ResponsiveListCard}
          data={data && data.companyHistory}
          ItemRenderer={({ item }: any) => <CompanyCard item={item} />}
          handleLoadMore={() => {}}
          hasMore={false}
        />
      </PageHeader>
    </>
  );
};

export default withContextInitialized(PersonDetail);
