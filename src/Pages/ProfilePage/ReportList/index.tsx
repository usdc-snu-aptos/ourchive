import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { baseColor, LargeButton, PaddingBox, StyledSpan } from '../../../styles';
import TopNavigator from '../../../Components/NavigatorComponents/TopNavigator';
import ImageSkeletonRenderer from '../../../Components/ImageComponents/ImageSkeletonRenderer';
import CreatorInfo from '../../../Components/CreatorInfo';
import MyVerticallyCenteredModal from '../../../Components/BTModal';

import profileIcon from '../../../images/profile-icon.png';
import BottomContainer from '../../../Components/NavigatorComponents/BottomContainer';
import { onchain } from '../../../func';
import { dateToString } from '../../../func/util';
import { IProveItem } from '../../../func/type';
import { nicknameState } from '../../../states/loginState';

interface IProveStatus {
  proveStatus: 0 | 1 | 2 | 3;
}

const EnumProveStatus = {
  0: 'Not Proved',
  1: 'Proved',
  2: 'Prove Requested',
  3: 'Cannot Prove',
};

const EnumProveColor = {
  0: baseColor.darkYellow,
  1: baseColor.green,
  2: baseColor.pink,
  3: baseColor.pink,
};

const ReportList = () => {
  const [reportList, setUploadList] = useState<IProveItem[]>([
    { creator: 'a', title: 'a', proved: 0, requestedDate: null, provedDate: null, keyPhrase: 'a', uri: 'a' },
  ]);
  const [nickname] = useRecoilState(nicknameState);

  useEffect(() => {
    // onchain.getReportList(nickname).then(data => {
    //   setUploadList(data);
    // });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <MyVerticallyCenteredModal
        show={true}
        onHide={() => console.log('f')}
        title="Submitting phrase completed"
        body={
          <p style={{ textAlign: 'center', fontWeight: 400, fontSize: '12px' }}>
            Your proof went perfectly.
            <br /> There will be no legal issues and the person who reported <br />
            it will know that you have proved it. Thank you for your proof process.
          </p>
        }
        footer={<LargeButton onClick={() => console.log('f')}>Go to prove List</LargeButton>}
      />

      <TopNavigator>
        <span style={{ fontSize: '18px' }}>Report list</span>
      </TopNavigator>

      <PaddingBox>
        {reportList.map(el => {
          const highlightsColor = EnumProveColor[el.proved];
          return (
            <div
              style={{
                display: 'flex',
                minWidth: 'fit-content',
                flexDirection: 'column',
                padding: '16px',
                border: '1px solid black',
                borderRadius: '16px',
                marginBottom: '16px',
              }}
            >
              <ProveStatus proveStatus={el.proved} />
              <div style={{ display: 'flex', marginTop: '-4px' }}>
                <ImageSkeletonRenderer
                  itemList={[
                    { creator: el.creator, creatorNickname: '', collection: '', name: el.title, uri: el.uri, price: 0 },
                  ]}
                  routeUrl="/Images"
                  style={{ wrapper: { paddingLeft: '0px' } }}
                  skeletonWidth={60}
                  skeletonHeight={60}
                  hideDetails
                />

                <div style={{ display: 'flex', width: '100%', flexDirection: 'column', padding: '18px 18px 18px 0px' }}>
                  <StyledSpan
                    style={{
                      fontWeight: 700,
                      fontSize: '15px',
                      whiteSpace: 'nowrap',
                      marginBottom: '4px',
                    }}
                  >
                    {el.title}
                  </StyledSpan>

                  <div style={{ marginTop: 'auto' }}>
                    <CreatorInfo
                      profileImg={profileIcon}
                      creator={nickname}
                      style={{
                        img: { width: '16px', height: '16px', marginRight: '4px' },
                        text: { fontSize: '10px', fontWeight: 700, marginBottom: '0px', color: 'black' },
                      }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.3)', marginBottom: '12px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 'auto', rowGap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <StyledSpan style={{ color: 'rgba(0,0,0,0.6)', whiteSpace: 'nowrap' }}>Requested Date</StyledSpan>
                  <StyledSpan style={{ whiteSpace: 'nowrap' }}>{dateToString(el.requestedDate)}</StyledSpan>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <StyledSpan style={{ color: 'rgba(0,0,0,0.6)', whiteSpace: 'nowrap' }}>Proved Date</StyledSpan>
                  <StyledSpan style={{ color: highlightsColor, whiteSpace: 'nowrap' }}>
                    {dateToString(el.provedDate)}
                  </StyledSpan>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <StyledSpan style={{ color: 'rgba(0,0,0,0.6)', whiteSpace: 'nowrap' }}>Key Phrase</StyledSpan>
                  <StyledSpan style={{ color: highlightsColor, whiteSpace: 'nowrap' }}>{el.keyPhrase}</StyledSpan>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <LargeButton style={{ width: '114px', minHeight: '30px', height: '30px' }}>Prove</LargeButton>
                </div>
              </div>
            </div>
          );
        })}
      </PaddingBox>
      <BottomContainer style={{ backgroundColor: baseColor.beige }}>
        <LargeButton>Report Image</LargeButton>
      </BottomContainer>
    </div>
  );
};
const ProveStatus = ({ proveStatus }: IProveStatus) => {
  const color = EnumProveColor[proveStatus];
  const status = EnumProveStatus[proveStatus];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px 12px',
        border: `1px solid ${color}`,
        width: 'fit-content',
        borderRadius: 48,
      }}
    >
      <div
        style={{
          width: '6px',
          height: '6px',
          backgroundColor: color,
          borderRadius: '50%',
          marginRight: '4px',
        }}
      />
      <span style={{ color, fontSize: '11px' }}>{status}</span>
    </div>
  );
};

export default ReportList;
