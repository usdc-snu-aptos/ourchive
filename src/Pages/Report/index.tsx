import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { baseColor, LargeButton, PaddingBox, StyledInput } from '../../styles';
import { reportImage } from '../../func';
import TopNavigator from '../../Components/TopNavigator';
import YellowBottomNavigator from '../../Components/YellowBottomNavigator';
import Modal from '../../Components/Modal';

const Report = () => {
  const [reqData, setReqData] = useState({ nickname: '', title: '', email: '' });
  const [modalOpen, setModalOpen] = useState(false);
  //request for proof

  const nav = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      {modalOpen && (
        <Modal close={() => setModalOpen(!modalOpen)}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px' }}>
            <span style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Request Completed</span>
            <span>Your request has been sent to</span>
            <span style={{ color: baseColor.yellow, marginBottom: '16px' }}>{`"${reqData.email}"`}</span>
            <span>The autogenerated phrase is</span>
            <span style={{ color: baseColor.yellow, marginBottom: '16px' }}>{`"${reqData.title}"`}</span>
            <PaddingBox style={{ width: '100%', padding: '0px 16px' }}>
              <LargeButton
                style={{ backgroundColor: baseColor.yellow, color: 'black', fontWeight: 700 }}
                onClick={() => nav(-1)}
              >
                Go to Report List
              </LargeButton>
            </PaddingBox>
          </div>
        </Modal>
      )}
      <TopNavigator>
        <span>Report Image</span>
      </TopNavigator>
      <PaddingBox>
        <span style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Creator Nickname</span>
        <StyledInput
          name="nickname"
          placeholder="Put Creator Nickname"
          onChange={e => setReqData({ ...reqData, [e.target?.name]: e.target.value })}
        />
      </PaddingBox>
      <PaddingBox>
        <span style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Image Title</span>
        <StyledInput
          name="title"
          placeholder="Put Image Title"
          onChange={e => setReqData({ ...reqData, [e.target?.name]: e.target.value })}
        />
      </PaddingBox>
      <PaddingBox>
        <span style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Email to Request</span>
        <StyledInput
          name="email"
          placeholder="Put Email Address"
          onChange={e => setReqData({ ...reqData, [e.target?.name]: e.target.value })}
        />
      </PaddingBox>
      <YellowBottomNavigator>
        <LargeButton
          disabled={!reqData.nickname || !reqData.email || !reqData.title}
          onClick={() => {
            reportImage();
            setModalOpen(true);
          }}
        >
          Request for Proof
        </LargeButton>
      </YellowBottomNavigator>
    </div>
  );
};

export default Report;
