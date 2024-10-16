import { Col, Row, Skeleton, Tooltip, message } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';
import './projectForms.scss';
import {
  CheckCircleOutlined,
  DislikeOutlined,
  ExclamationCircleOutlined,
  FileAddOutlined,
  LikeOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';
import moment from 'moment';
import { RejectDocumentationConfirmationModel } from '../../Models/rejectDocumenConfirmationModel';
import { useUserContext } from '../../../Context/UserInformationContext/userInformationContext';
import { useConnection } from '../../../Context/ConnectionContext/connectionContext';
import { ProgrammeStageUnified } from '../../../Definitions/Enums/programmeStage.enum';
import { DocType } from '../../../Definitions/Enums/document.type';
import { Role } from '../../../Definitions/Enums/role.enum';
import { isValidateFileType } from '../../../Utils/DocumentValidator';
import { DocumentStatus } from '../../../Definitions/Enums/document.status';
import { CompanyRole } from '../../../Definitions/Enums/company.role.enum';
import { linkDocVisible, uploadDocUserPermission } from '../../../Utils/documentsPermissionSl';

export interface ProjectFormProps {
  data: any;
  title: any;
  icon: any;
  programmeId: any;
  programmeOwnerId: number;
  getDocumentDetails: any;
  getProgrammeById: any;
  ministryLevelPermission?: boolean;
  translator: any;
  programmeStatus?: any;
}

export const ProjectForms: FC<ProjectFormProps> = (props: ProjectFormProps) => {
  const {
    data,
    title,
    icon,
    programmeId,
    programmeOwnerId,
    getDocumentDetails,
    getProgrammeById,
    ministryLevelPermission,
    translator,
    programmeStatus,
  } = props;

  const t = translator.t;
  const { userInfoState } = useUserContext();
  const { delete: del, post } = useConnection();
  const fileInputRef: any = useRef(null);
  const fileInputRefMeth: any = useRef(null);
  const fileInputRefImpactAssessment: any = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [designDocUrl, setDesignDocUrl] = useState<any>('');
  const [noObjectionDocUrl, setNoObjectionDocUrl] = useState<any>('');
  const [authorisationDocUrl, setAuthorisationDocUrl] = useState<any>('');
  const [methodologyDocUrl, setMethodologyDocUrl] = useState<any>('');
  const [designDocDate, setDesignDocDate] = useState<any>('');
  const [noObjectionDate, setNoObjectionDate] = useState<any>('');
  const [methodologyDate, setMethodologyDate] = useState<any>('');
  const [authorisationDocDate, setAuthorisationDocDate] = useState<any>('');
  const [designDocStatus, setDesignDocStatus] = useState<any>('');
  const [methodDocStatus, setMethodDocStatus] = useState<any>('');
  const [designDocId, setDesignDocId] = useState<any>('');
  const [designDocversion, setDesignDocversion] = useState<any>('');
  const [methDocId, setMethDocId] = useState<any>('');
  const [methDocversion, setMethDocversion] = useState<any>('');
  const [docData, setDocData] = useState<any[]>([]);
  const [openRejectDocConfirmationModal, setOpenRejectDocConfirmationModal] = useState(false);
  const [actionInfo, setActionInfo] = useState<any>({});
  const [rejectDocData, setRejectDocData] = useState<any>({});
  const [impactAssessmentUrl, setImpactAssessmentUrl] = useState<any>('');
  const [impactAssessmentDate, setImpactAssessmentDate] = useState<any>('');
  const [impactAssessmentStatus, setImpactAssessmentStatus] = useState<any>('');
  const [impactAssessmentId, setImpactAssessmentId] = useState<any>('');
  const [impactAssessmentversion, setImpactAssessmentversion] = useState<any>('');
  const maximumImageSize = process.env.REACT_APP_MAXIMUM_FILE_SIZE
    ? parseInt(process.env.REACT_APP_MAXIMUM_FILE_SIZE)
    : 5000000;

  const isProjectRejected = programmeStatus && programmeStatus === ProgrammeStageUnified.Rejected;

  const uploadImpactAssessmentDocUserPermission = uploadDocUserPermission(
    userInfoState,
    DocType.ENVIRONMENTAL_IMPACT_ASSESSMENT,
    programmeOwnerId,
    ministryLevelPermission
  );

  const impactAssessmentToolTipTitle =
    userInfoState?.userRole === Role.ViewOnly
      ? t('projectDetailsView:notAuthToUploadDoc')
      : isProjectRejected
      ? t('projectDetailsView:docUploadProgrammeRejected')
      : !uploadImpactAssessmentDocUserPermission && t('projectDetailsView:orgNotAuth');

  const handleDesignDocFileUpload = () => {
    fileInputRef?.current?.click();
  };

  const handleMethodologyFileUpload = () => {
    fileInputRefMeth?.current?.click();
  };

  const handleImpactAssessmentFileUpload = () => {
    fileInputRefImpactAssessment?.current?.click();
  };

  useEffect(() => {
    setDocData(data);
  }, [data]);

  useEffect(() => {
    if (docData?.length) {
      docData?.map((item: any) => {
        if (item?.url?.includes('DESIGN')) {
          setDesignDocUrl(item?.url);
          setDesignDocDate(item?.txTime);
          setDesignDocStatus(item?.status);
          setDesignDocId(item?.id);
          const versionfull = (item?.url).split('_')[(item?.url).split('_').length - 1];
          const version = versionfull ? versionfull.split('.')[0] : '1';
          setDesignDocversion(version.startsWith('V') ? version : 'V1');
        }
        if (item?.url?.includes('METHODOLOGY')) {
          setMethodologyDocUrl(item?.url);
          setMethodologyDate(item?.txTime);
          setMethodDocStatus(item?.status);
          setMethDocId(item?.id);
          const versionfull = (item?.url).split('_')[(item?.url).split('_').length - 1];
          const version = versionfull ? versionfull.split('.')[0] : '1';
          setMethDocversion(version.startsWith('V') ? version : 'V1');
        }
        if (item?.url?.includes('OBJECTION')) {
          setNoObjectionDocUrl(item?.url);
          setNoObjectionDate(item?.txTime);
        }
        if (item?.url?.includes('AUTHORISATION')) {
          setAuthorisationDocUrl(item?.url);
          setAuthorisationDocDate(item?.txTime);
        }
        if (item?.url?.includes('ENVIRONMENTAL_IMPACT_ASSESSMENT')) {
          setImpactAssessmentUrl(item?.url);
          setImpactAssessmentDate(item?.txTime);
          setImpactAssessmentStatus(item?.status);
          setImpactAssessmentId(item?.id);
          const versionfull = (item?.url).split('_')[(item?.url).split('_').length - 1];
          const version = versionfull ? versionfull.split('.')[0] : '1';
          setImpactAssessmentversion(version.startsWith('V') ? version : 'V1');
        }
      });
    }
  }, [docData]);

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const onUploadDocument = async (file: any, type: any) => {
    if (file.size > maximumImageSize) {
      message.open({
        type: 'error',
        content: `${t('common:maxSizeVal')}`,
        duration: 4,
        style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
      });
      return;
    }

    setLoading(true);
    const logoBase64 = await getBase64(file as RcFile);
    try {
      if (isValidateFileType(file?.type, type)) {
        const response: any = await post('national/programme/addDocument', {
          type: type,
          data: logoBase64,
          programmeId: programmeId,
        });
        fileInputRefMeth.current = null;
        if (response?.data) {
          setDocData([...docData, response?.data]);
          message.open({
            type: 'success',
            content: `${t('projectDetailsView:isUploaded')}`,
            duration: 4,
            style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
          });
        }
      } else {
        message.open({
          type: 'error',
          content: `${t('projectDetailsView:invalidFileFormat')}`,
          duration: 4,
          style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
        });
      }
    } catch (error: any) {
      fileInputRefMeth.current = null;
      message.open({
        type: 'error',
        content: `${t('projectDetailsView:notUploaded')}`,
        duration: 4,
        style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
      });
    } finally {
      getDocumentDetails();
      setLoading(false);
    }
  };

  const docAction = async (id: any, status: DocumentStatus) => {
    setLoading(true);
    try {
      const response: any = await post('national/programme/docAction', {
        id: id,
        status: status,
      });
      message.open({
        type: 'success',
        content:
          status === DocumentStatus.ACCEPTED
            ? `${t('projectDetailsView:docApproved')}`
            : `${t('projectDetailsView:docRejected')}`,
        duration: 4,
        style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
      });
    } catch (error: any) {
      message.open({
        type: 'error',
        content: error?.message,
        duration: 4,
        style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
      });
    } finally {
      setOpenRejectDocConfirmationModal(false);
      getDocumentDetails();
      getProgrammeById();
      setLoading(false);
    }
  };

  const handleOk = () => {
    docAction(rejectDocData?.id, DocumentStatus.REJECTED);
  };

  const handleCancel = () => {
    setOpenRejectDocConfirmationModal(false);
  };

  const companyRolePermission =
    userInfoState?.companyRole === CompanyRole.GOVERNMENT &&
    userInfoState?.userRole !== Role.ViewOnly;

  const designDocActionPermission =
    userInfoState?.companyRole === CompanyRole.GOVERNMENT &&
    userInfoState?.userRole !== Role.ViewOnly;

  const designDocPending = designDocStatus === DocumentStatus.PENDING;
  return loading ? (
    <Skeleton />
  ) : (
    <>
      <div className="info-view">
        <div className="title">
          <span className="title-icon">{icon}</span>
          <span className="title-text">{title}</span>
        </div>
        <div>
          <Row className="field" key="Cost Quatation">
            <Col span={18} className="field-key">
              <div className="label-container">
                <div className={designDocUrl !== '' ? 'label-uploaded' : 'label'}>
                  {t('projectDetailsView:costQuatationForm')}
                </div>
                {designDocPending && (designDocActionPermission || ministryLevelPermission) && (
                  <>
                    <LikeOutlined
                      onClick={() => docAction(designDocId, DocumentStatus.ACCEPTED)}
                      className="common-progress-icon"
                      style={{ color: '#976ED7', paddingTop: '3px' }}
                    />
                    <DislikeOutlined
                      onClick={() => {
                        setRejectDocData({ id: designDocId });
                        setActionInfo({
                          action: 'Reject',
                          headerText: `${t('projectDetailsView:rejectDocHeader')}`,
                          text: `${t('projectDetailsView:rejectDocBody')}`,
                          type: 'reject',
                          icon: <DislikeOutlined />,
                        });
                        setOpenRejectDocConfirmationModal(true);
                      }}
                      className="common-progress-icon margin-left-1"
                      style={{ color: '#FD6F70', paddingTop: '3px' }}
                    />
                  </>
                )}
                {designDocStatus === DocumentStatus.ACCEPTED && (
                  <CheckCircleOutlined
                    className="common-progress-icon"
                    style={{ color: '#5DC380', paddingTop: '3px' }}
                  />
                )}
                {designDocStatus === DocumentStatus.REJECTED && (
                  <Tooltip
                    arrowPointAtCenter
                    placement="top"
                    trigger="hover"
                    title={t('projectDetailsView:rejectTip')}
                    overlayClassName="custom-tooltip"
                  >
                    <ExclamationCircleOutlined
                      className="common-progress-icon"
                      style={{ color: '#FD6F70' }}
                    />
                  </Tooltip>
                )}
              </div>
              {designDocUrl !== '' && (
                <div className="time">
                  {moment(parseInt(designDocDate)).format('DD MMMM YYYY @ HH:mm')}
                  {' ~ ' + designDocversion}
                </div>
              )}
            </Col>
            <Col span={6} className="field-value">
              {designDocUrl !== '' ? (
                <div className="link">
                  {linkDocVisible(designDocStatus) && (
                    <a href={designDocUrl} target="_blank" rel="noopener noreferrer" download>
                      <BookOutlined className="common-progress-icon" style={{ color: '#3F3A47' }} />
                    </a>
                  )}
                  {designDocStatus !== DocumentStatus.ACCEPTED && (
                    <>
                      <Tooltip
                        arrowPointAtCenter
                        placement="top"
                        trigger="hover"
                        title={
                          userInfoState?.userRole === Role.ViewOnly ||
                          userInfoState?.companyRole === CompanyRole.CERTIFIER
                            ? t('projectDetailsView:notAuthToUploadDoc')
                            : !uploadDocUserPermission(
                                userInfoState,
                                DocType.DESIGN_DOCUMENT,
                                programmeOwnerId,
                                ministryLevelPermission
                              ) && t('projectDetailsView:orgNotAuth')
                        }
                        overlayClassName="custom-tooltip"
                      >
                        <FileAddOutlined
                          className="common-progress-icon"
                          style={
                            uploadDocUserPermission(
                              userInfoState,
                              DocType.DESIGN_DOCUMENT,
                              programmeOwnerId,
                              ministryLevelPermission
                            )
                              ? {
                                  color: '#3F3A47',
                                  cursor: 'pointer',
                                  margin: '0px 0px 1.5px 0px',
                                }
                              : {
                                  color: '#cacaca',
                                  cursor: 'default',
                                  margin: '0px 0px 1.5px 0px',
                                }
                          }
                          onClick={() =>
                            uploadDocUserPermission(
                              userInfoState,
                              DocType.DESIGN_DOCUMENT,
                              programmeOwnerId,
                              ministryLevelPermission
                            ) && handleDesignDocFileUpload()
                          }
                        />
                      </Tooltip>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".xls, .xlsx, .ppt, .pptx, .csv, .doc, .docx, .pdf, .png, .jpg"
                        onChange={(e: any) => {
                          const selectedFile = e.target.files[0];
                          e.target.value = null;
                          onUploadDocument(selectedFile, DocType.DESIGN_DOCUMENT);
                        }}
                      />
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Tooltip
                    arrowPointAtCenter
                    placement="top"
                    trigger="hover"
                    title={
                      userInfoState?.userRole === Role.ViewOnly ||
                      userInfoState?.companyRole === CompanyRole.CERTIFIER
                        ? t('projectDetailsView:notAuthToUploadDoc')
                        : !uploadDocUserPermission(
                            userInfoState,
                            DocType.DESIGN_DOCUMENT,
                            programmeOwnerId,
                            ministryLevelPermission
                          ) && t('projectDetailsView:orgNotAuth')
                    }
                    overlayClassName="custom-tooltip"
                  >
                    <FileAddOutlined
                      className="common-progress-icon"
                      style={
                        uploadDocUserPermission(
                          userInfoState,
                          DocType.DESIGN_DOCUMENT,
                          programmeOwnerId,
                          ministryLevelPermission
                        )
                          ? {
                              color: '#3F3A47',
                              cursor: 'pointer',
                              margin: '0px 0px 1.5px 0px',
                            }
                          : {
                              color: '#cacaca',
                              cursor: 'default',
                              margin: '0px 0px 1.5px 0px',
                            }
                      }
                      onClick={() =>
                        uploadDocUserPermission(
                          userInfoState,
                          DocType.DESIGN_DOCUMENT,
                          programmeOwnerId,
                          ministryLevelPermission
                        ) && handleDesignDocFileUpload()
                      }
                    />
                  </Tooltip>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".xls, .xlsx, .ppt, .pptx, .csv, .doc, .docx, .pdf, .png, .jpg"
                    onChange={(e: any) => {
                      const selectedFile = e.target.files[0];
                      e.target.value = null;
                      onUploadDocument(selectedFile, DocType.DESIGN_DOCUMENT);
                    }}
                  />
                </>
              )}
            </Col>
          </Row>
          <Row className="field" key="Proposal">
            <Col span={18} className="field-key">
              <div className="label-container">
                <div className={designDocUrl !== '' ? 'label-uploaded' : 'label'}>
                  {t('projectDetailsView:proposalForm')}
                </div>
                {designDocPending && (designDocActionPermission || ministryLevelPermission) && (
                  <>
                    <LikeOutlined
                      onClick={() => docAction(designDocId, DocumentStatus.ACCEPTED)}
                      className="common-progress-icon"
                      style={{ color: '#976ED7', paddingTop: '3px' }}
                    />
                    <DislikeOutlined
                      onClick={() => {
                        setRejectDocData({ id: designDocId });
                        setActionInfo({
                          action: 'Reject',
                          headerText: `${t('projectDetailsView:rejectDocHeader')}`,
                          text: `${t('projectDetailsView:rejectDocBody')}`,
                          type: 'reject',
                          icon: <DislikeOutlined />,
                        });
                        setOpenRejectDocConfirmationModal(true);
                      }}
                      className="common-progress-icon margin-left-1"
                      style={{ color: '#FD6F70', paddingTop: '3px' }}
                    />
                  </>
                )}
                {designDocStatus === DocumentStatus.ACCEPTED && (
                  <CheckCircleOutlined
                    className="common-progress-icon"
                    style={{ color: '#5DC380', paddingTop: '3px' }}
                  />
                )}
                {designDocStatus === DocumentStatus.REJECTED && (
                  <Tooltip
                    arrowPointAtCenter
                    placement="top"
                    trigger="hover"
                    title={t('projectDetailsView:rejectTip')}
                    overlayClassName="custom-tooltip"
                  >
                    <ExclamationCircleOutlined
                      className="common-progress-icon"
                      style={{ color: '#FD6F70' }}
                    />
                  </Tooltip>
                )}
              </div>
              {designDocUrl !== '' && (
                <div className="time">
                  {moment(parseInt(designDocDate)).format('DD MMMM YYYY @ HH:mm')}
                  {' ~ ' + designDocversion}
                </div>
              )}
            </Col>
            <Col span={6} className="field-value">
              {designDocUrl !== '' ? (
                <div className="link">
                  {linkDocVisible(designDocStatus) && (
                    <a href={designDocUrl} target="_blank" rel="noopener noreferrer" download>
                      <BookOutlined className="common-progress-icon" style={{ color: '#3F3A47' }} />
                    </a>
                  )}
                  {designDocStatus !== DocumentStatus.ACCEPTED && (
                    <>
                      <Tooltip
                        arrowPointAtCenter
                        placement="top"
                        trigger="hover"
                        title={
                          userInfoState?.userRole === Role.ViewOnly ||
                          userInfoState?.companyRole === CompanyRole.CERTIFIER
                            ? t('projectDetailsView:notAuthToUploadDoc')
                            : !uploadDocUserPermission(
                                userInfoState,
                                DocType.DESIGN_DOCUMENT,
                                programmeOwnerId,
                                ministryLevelPermission
                              ) && t('projectDetailsView:orgNotAuth')
                        }
                        overlayClassName="custom-tooltip"
                      >
                        <FileAddOutlined
                          className="common-progress-icon"
                          style={
                            uploadDocUserPermission(
                              userInfoState,
                              DocType.DESIGN_DOCUMENT,
                              programmeOwnerId,
                              ministryLevelPermission
                            )
                              ? {
                                  color: '#3F3A47',
                                  cursor: 'pointer',
                                  margin: '0px 0px 1.5px 0px',
                                }
                              : {
                                  color: '#cacaca',
                                  cursor: 'default',
                                  margin: '0px 0px 1.5px 0px',
                                }
                          }
                          onClick={() =>
                            uploadDocUserPermission(
                              userInfoState,
                              DocType.DESIGN_DOCUMENT,
                              programmeOwnerId,
                              ministryLevelPermission
                            ) && handleDesignDocFileUpload()
                          }
                        />
                      </Tooltip>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".xls, .xlsx, .ppt, .pptx, .csv, .doc, .docx, .pdf, .png, .jpg"
                        onChange={(e: any) => {
                          const selectedFile = e.target.files[0];
                          e.target.value = null;
                          onUploadDocument(selectedFile, DocType.DESIGN_DOCUMENT);
                        }}
                      />
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Tooltip
                    arrowPointAtCenter
                    placement="top"
                    trigger="hover"
                    title={
                      userInfoState?.userRole === Role.ViewOnly ||
                      userInfoState?.companyRole === CompanyRole.CERTIFIER
                        ? t('projectDetailsView:notAuthToUploadDoc')
                        : !uploadDocUserPermission(
                            userInfoState,
                            DocType.DESIGN_DOCUMENT,
                            programmeOwnerId,
                            ministryLevelPermission
                          ) && t('projectDetailsView:orgNotAuth')
                    }
                    overlayClassName="custom-tooltip"
                  >
                    <FileAddOutlined
                      className="common-progress-icon"
                      style={
                        uploadDocUserPermission(
                          userInfoState,
                          DocType.DESIGN_DOCUMENT,
                          programmeOwnerId,
                          ministryLevelPermission
                        )
                          ? {
                              color: '#3F3A47',
                              cursor: 'pointer',
                              margin: '0px 0px 1.5px 0px',
                            }
                          : {
                              color: '#cacaca',
                              cursor: 'default',
                              margin: '0px 0px 1.5px 0px',
                            }
                      }
                      onClick={() =>
                        uploadDocUserPermission(
                          userInfoState,
                          DocType.DESIGN_DOCUMENT,
                          programmeOwnerId,
                          ministryLevelPermission
                        ) && handleDesignDocFileUpload()
                      }
                    />
                  </Tooltip>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".xls, .xlsx, .ppt, .pptx, .csv, .doc, .docx, .pdf, .png, .jpg"
                    onChange={(e: any) => {
                      const selectedFile = e.target.files[0];
                      e.target.value = null;
                      onUploadDocument(selectedFile, DocType.DESIGN_DOCUMENT);
                    }}
                  />
                </>
              )}
            </Col>
          </Row>
          <Row className="field" key="Validation Agreement">
            <Col span={18} className="field-key">
              <div className="label-container">
                <div className={designDocUrl !== '' ? 'label-uploaded' : 'label'}>
                  {t('projectDetailsView:validationAgreementForm')}
                </div>
                {designDocPending && (designDocActionPermission || ministryLevelPermission) && (
                  <>
                    <LikeOutlined
                      onClick={() => docAction(designDocId, DocumentStatus.ACCEPTED)}
                      className="common-progress-icon"
                      style={{ color: '#976ED7', paddingTop: '3px' }}
                    />
                    <DislikeOutlined
                      onClick={() => {
                        setRejectDocData({ id: designDocId });
                        setActionInfo({
                          action: 'Reject',
                          headerText: `${t('projectDetailsView:rejectDocHeader')}`,
                          text: `${t('projectDetailsView:rejectDocBody')}`,
                          type: 'reject',
                          icon: <DislikeOutlined />,
                        });
                        setOpenRejectDocConfirmationModal(true);
                      }}
                      className="common-progress-icon margin-left-1"
                      style={{ color: '#FD6F70', paddingTop: '3px' }}
                    />
                  </>
                )}
                {designDocStatus === DocumentStatus.ACCEPTED && (
                  <CheckCircleOutlined
                    className="common-progress-icon"
                    style={{ color: '#5DC380', paddingTop: '3px' }}
                  />
                )}
                {designDocStatus === DocumentStatus.REJECTED && (
                  <Tooltip
                    arrowPointAtCenter
                    placement="top"
                    trigger="hover"
                    title={t('projectDetailsView:rejectTip')}
                    overlayClassName="custom-tooltip"
                  >
                    <ExclamationCircleOutlined
                      className="common-progress-icon"
                      style={{ color: '#FD6F70' }}
                    />
                  </Tooltip>
                )}
              </div>
              {designDocUrl !== '' && (
                <div className="time">
                  {moment(parseInt(designDocDate)).format('DD MMMM YYYY @ HH:mm')}
                  {' ~ ' + designDocversion}
                </div>
              )}
            </Col>
            <Col span={6} className="field-value">
              {designDocUrl !== '' ? (
                <div className="link">
                  {linkDocVisible(designDocStatus) && (
                    <a href={designDocUrl} target="_blank" rel="noopener noreferrer" download>
                      <BookOutlined className="common-progress-icon" style={{ color: '#3F3A47' }} />
                    </a>
                  )}
                  {designDocStatus !== DocumentStatus.ACCEPTED && (
                    <>
                      <Tooltip
                        arrowPointAtCenter
                        placement="top"
                        trigger="hover"
                        title={
                          userInfoState?.userRole === Role.ViewOnly ||
                          userInfoState?.companyRole === CompanyRole.CERTIFIER
                            ? t('projectDetailsView:notAuthToUploadDoc')
                            : !uploadDocUserPermission(
                                userInfoState,
                                DocType.DESIGN_DOCUMENT,
                                programmeOwnerId,
                                ministryLevelPermission
                              ) && t('projectDetailsView:orgNotAuth')
                        }
                        overlayClassName="custom-tooltip"
                      >
                        <FileAddOutlined
                          className="common-progress-icon"
                          style={
                            uploadDocUserPermission(
                              userInfoState,
                              DocType.DESIGN_DOCUMENT,
                              programmeOwnerId,
                              ministryLevelPermission
                            )
                              ? {
                                  color: '#3F3A47',
                                  cursor: 'pointer',
                                  margin: '0px 0px 1.5px 0px',
                                }
                              : {
                                  color: '#cacaca',
                                  cursor: 'default',
                                  margin: '0px 0px 1.5px 0px',
                                }
                          }
                          onClick={() =>
                            uploadDocUserPermission(
                              userInfoState,
                              DocType.DESIGN_DOCUMENT,
                              programmeOwnerId,
                              ministryLevelPermission
                            ) && handleDesignDocFileUpload()
                          }
                        />
                      </Tooltip>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".xls, .xlsx, .ppt, .pptx, .csv, .doc, .docx, .pdf, .png, .jpg"
                        onChange={(e: any) => {
                          const selectedFile = e.target.files[0];
                          e.target.value = null;
                          onUploadDocument(selectedFile, DocType.DESIGN_DOCUMENT);
                        }}
                      />
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Tooltip
                    arrowPointAtCenter
                    placement="top"
                    trigger="hover"
                    title={
                      userInfoState?.userRole === Role.ViewOnly ||
                      userInfoState?.companyRole === CompanyRole.CERTIFIER
                        ? t('projectDetailsView:notAuthToUploadDoc')
                        : !uploadDocUserPermission(
                            userInfoState,
                            DocType.DESIGN_DOCUMENT,
                            programmeOwnerId,
                            ministryLevelPermission
                          ) && t('projectDetailsView:orgNotAuth')
                    }
                    overlayClassName="custom-tooltip"
                  >
                    <FileAddOutlined
                      className="common-progress-icon"
                      style={
                        uploadDocUserPermission(
                          userInfoState,
                          DocType.DESIGN_DOCUMENT,
                          programmeOwnerId,
                          ministryLevelPermission
                        )
                          ? {
                              color: '#3F3A47',
                              cursor: 'pointer',
                              margin: '0px 0px 1.5px 0px',
                            }
                          : {
                              color: '#cacaca',
                              cursor: 'default',
                              margin: '0px 0px 1.5px 0px',
                            }
                      }
                      onClick={() =>
                        uploadDocUserPermission(
                          userInfoState,
                          DocType.DESIGN_DOCUMENT,
                          programmeOwnerId,
                          ministryLevelPermission
                        ) && handleDesignDocFileUpload()
                      }
                    />
                  </Tooltip>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".xls, .xlsx, .ppt, .pptx, .csv, .doc, .docx, .pdf, .png, .jpg"
                    onChange={(e: any) => {
                      const selectedFile = e.target.files[0];
                      e.target.value = null;
                      onUploadDocument(selectedFile, DocType.DESIGN_DOCUMENT);
                    }}
                  />
                </>
              )}
            </Col>
          </Row>
          <Row className="field" key="Carbon Management Assessment (CMA)">
            <Col span={18} className="field-key">
              <div className="label-container">
                <div className={designDocUrl !== '' ? 'label-uploaded' : 'label'}>
                  {t('projectDetailsView:cmaForm')}
                </div>
                {designDocPending && (designDocActionPermission || ministryLevelPermission) && (
                  <>
                    <LikeOutlined
                      onClick={() => docAction(designDocId, DocumentStatus.ACCEPTED)}
                      className="common-progress-icon"
                      style={{ color: '#976ED7', paddingTop: '3px' }}
                    />
                    <DislikeOutlined
                      onClick={() => {
                        setRejectDocData({ id: designDocId });
                        setActionInfo({
                          action: 'Reject',
                          headerText: `${t('projectDetailsView:rejectDocHeader')}`,
                          text: `${t('projectDetailsView:rejectDocBody')}`,
                          type: 'reject',
                          icon: <DislikeOutlined />,
                        });
                        setOpenRejectDocConfirmationModal(true);
                      }}
                      className="common-progress-icon margin-left-1"
                      style={{ color: '#FD6F70', paddingTop: '3px' }}
                    />
                  </>
                )}
                {designDocStatus === DocumentStatus.ACCEPTED && (
                  <CheckCircleOutlined
                    className="common-progress-icon"
                    style={{ color: '#5DC380', paddingTop: '3px' }}
                  />
                )}
                {designDocStatus === DocumentStatus.REJECTED && (
                  <Tooltip
                    arrowPointAtCenter
                    placement="top"
                    trigger="hover"
                    title={t('projectDetailsView:rejectTip')}
                    overlayClassName="custom-tooltip"
                  >
                    <ExclamationCircleOutlined
                      className="common-progress-icon"
                      style={{ color: '#FD6F70' }}
                    />
                  </Tooltip>
                )}
              </div>
              {designDocUrl !== '' && (
                <div className="time">
                  {moment(parseInt(designDocDate)).format('DD MMMM YYYY @ HH:mm')}
                  {' ~ ' + designDocversion}
                </div>
              )}
            </Col>
            <Col span={6} className="field-value">
              {designDocUrl !== '' ? (
                <div className="link">
                  {linkDocVisible(designDocStatus) && (
                    <a href={designDocUrl} target="_blank" rel="noopener noreferrer" download>
                      <BookOutlined className="common-progress-icon" style={{ color: '#3F3A47' }} />
                    </a>
                  )}
                  {designDocStatus !== DocumentStatus.ACCEPTED && (
                    <>
                      <Tooltip
                        arrowPointAtCenter
                        placement="top"
                        trigger="hover"
                        title={
                          userInfoState?.userRole === Role.ViewOnly ||
                          userInfoState?.companyRole === CompanyRole.CERTIFIER
                            ? t('projectDetailsView:notAuthToUploadDoc')
                            : !uploadDocUserPermission(
                                userInfoState,
                                DocType.DESIGN_DOCUMENT,
                                programmeOwnerId,
                                ministryLevelPermission
                              ) && t('projectDetailsView:orgNotAuth')
                        }
                        overlayClassName="custom-tooltip"
                      >
                        <FileAddOutlined
                          className="common-progress-icon"
                          style={
                            uploadDocUserPermission(
                              userInfoState,
                              DocType.DESIGN_DOCUMENT,
                              programmeOwnerId,
                              ministryLevelPermission
                            )
                              ? {
                                  color: '#3F3A47',
                                  cursor: 'pointer',
                                  margin: '0px 0px 1.5px 0px',
                                }
                              : {
                                  color: '#cacaca',
                                  cursor: 'default',
                                  margin: '0px 0px 1.5px 0px',
                                }
                          }
                          onClick={() =>
                            uploadDocUserPermission(
                              userInfoState,
                              DocType.DESIGN_DOCUMENT,
                              programmeOwnerId,
                              ministryLevelPermission
                            ) && handleDesignDocFileUpload()
                          }
                        />
                      </Tooltip>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".xls, .xlsx, .ppt, .pptx, .csv, .doc, .docx, .pdf, .png, .jpg"
                        onChange={(e: any) => {
                          const selectedFile = e.target.files[0];
                          e.target.value = null;
                          onUploadDocument(selectedFile, DocType.DESIGN_DOCUMENT);
                        }}
                      />
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Tooltip
                    arrowPointAtCenter
                    placement="top"
                    trigger="hover"
                    title={
                      userInfoState?.userRole === Role.ViewOnly ||
                      userInfoState?.companyRole === CompanyRole.CERTIFIER
                        ? t('projectDetailsView:notAuthToUploadDoc')
                        : !uploadDocUserPermission(
                            userInfoState,
                            DocType.DESIGN_DOCUMENT,
                            programmeOwnerId,
                            ministryLevelPermission
                          ) && t('projectDetailsView:orgNotAuth')
                    }
                    overlayClassName="custom-tooltip"
                  >
                    <FileAddOutlined
                      className="common-progress-icon"
                      style={
                        uploadDocUserPermission(
                          userInfoState,
                          DocType.DESIGN_DOCUMENT,
                          programmeOwnerId,
                          ministryLevelPermission
                        )
                          ? {
                              color: '#3F3A47',
                              cursor: 'pointer',
                              margin: '0px 0px 1.5px 0px',
                            }
                          : {
                              color: '#cacaca',
                              cursor: 'default',
                              margin: '0px 0px 1.5px 0px',
                            }
                      }
                      onClick={() =>
                        uploadDocUserPermission(
                          userInfoState,
                          DocType.DESIGN_DOCUMENT,
                          programmeOwnerId,
                          ministryLevelPermission
                        ) && handleDesignDocFileUpload()
                      }
                    />
                  </Tooltip>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".xls, .xlsx, .ppt, .pptx, .csv, .doc, .docx, .pdf, .png, .jpg"
                    onChange={(e: any) => {
                      const selectedFile = e.target.files[0];
                      e.target.value = null;
                      onUploadDocument(selectedFile, DocType.DESIGN_DOCUMENT);
                    }}
                  />
                </>
              )}
            </Col>
          </Row>
          <Row className="field" key="Validation Report">
            <Col span={18} className="field-key">
              <div className="label-container">
                <div className={designDocUrl !== '' ? 'label-uploaded' : 'label'}>
                  {t('projectDetailsView:validationReportForm')}
                </div>
                {designDocPending && (designDocActionPermission || ministryLevelPermission) && (
                  <>
                    <LikeOutlined
                      onClick={() => docAction(designDocId, DocumentStatus.ACCEPTED)}
                      className="common-progress-icon"
                      style={{ color: '#976ED7', paddingTop: '3px' }}
                    />
                    <DislikeOutlined
                      onClick={() => {
                        setRejectDocData({ id: designDocId });
                        setActionInfo({
                          action: 'Reject',
                          headerText: `${t('projectDetailsView:rejectDocHeader')}`,
                          text: `${t('projectDetailsView:rejectDocBody')}`,
                          type: 'reject',
                          icon: <DislikeOutlined />,
                        });
                        setOpenRejectDocConfirmationModal(true);
                      }}
                      className="common-progress-icon margin-left-1"
                      style={{ color: '#FD6F70', paddingTop: '3px' }}
                    />
                  </>
                )}
                {designDocStatus === DocumentStatus.ACCEPTED && (
                  <CheckCircleOutlined
                    className="common-progress-icon"
                    style={{ color: '#5DC380', paddingTop: '3px' }}
                  />
                )}
                {designDocStatus === DocumentStatus.REJECTED && (
                  <Tooltip
                    arrowPointAtCenter
                    placement="top"
                    trigger="hover"
                    title={t('projectDetailsView:rejectTip')}
                    overlayClassName="custom-tooltip"
                  >
                    <ExclamationCircleOutlined
                      className="common-progress-icon"
                      style={{ color: '#FD6F70' }}
                    />
                  </Tooltip>
                )}
              </div>
              {designDocUrl !== '' && (
                <div className="time">
                  {moment(parseInt(designDocDate)).format('DD MMMM YYYY @ HH:mm')}
                  {' ~ ' + designDocversion}
                </div>
              )}
            </Col>
            <Col span={6} className="field-value">
              {designDocUrl !== '' ? (
                <div className="link">
                  {linkDocVisible(designDocStatus) && (
                    <a href={designDocUrl} target="_blank" rel="noopener noreferrer" download>
                      <BookOutlined className="common-progress-icon" style={{ color: '#3F3A47' }} />
                    </a>
                  )}
                  {designDocStatus !== DocumentStatus.ACCEPTED && (
                    <>
                      <Tooltip
                        arrowPointAtCenter
                        placement="top"
                        trigger="hover"
                        title={
                          userInfoState?.userRole === Role.ViewOnly ||
                          userInfoState?.companyRole === CompanyRole.CERTIFIER
                            ? t('projectDetailsView:notAuthToUploadDoc')
                            : !uploadDocUserPermission(
                                userInfoState,
                                DocType.DESIGN_DOCUMENT,
                                programmeOwnerId,
                                ministryLevelPermission
                              ) && t('projectDetailsView:orgNotAuth')
                        }
                        overlayClassName="custom-tooltip"
                      >
                        <FileAddOutlined
                          className="common-progress-icon"
                          style={
                            uploadDocUserPermission(
                              userInfoState,
                              DocType.DESIGN_DOCUMENT,
                              programmeOwnerId,
                              ministryLevelPermission
                            )
                              ? {
                                  color: '#3F3A47',
                                  cursor: 'pointer',
                                  margin: '0px 0px 1.5px 0px',
                                }
                              : {
                                  color: '#cacaca',
                                  cursor: 'default',
                                  margin: '0px 0px 1.5px 0px',
                                }
                          }
                          onClick={() =>
                            uploadDocUserPermission(
                              userInfoState,
                              DocType.DESIGN_DOCUMENT,
                              programmeOwnerId,
                              ministryLevelPermission
                            ) && handleDesignDocFileUpload()
                          }
                        />
                      </Tooltip>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".xls, .xlsx, .ppt, .pptx, .csv, .doc, .docx, .pdf, .png, .jpg"
                        onChange={(e: any) => {
                          const selectedFile = e.target.files[0];
                          e.target.value = null;
                          onUploadDocument(selectedFile, DocType.DESIGN_DOCUMENT);
                        }}
                      />
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Tooltip
                    arrowPointAtCenter
                    placement="top"
                    trigger="hover"
                    title={
                      userInfoState?.userRole === Role.ViewOnly ||
                      userInfoState?.companyRole === CompanyRole.CERTIFIER
                        ? t('projectDetailsView:notAuthToUploadDoc')
                        : !uploadDocUserPermission(
                            userInfoState,
                            DocType.DESIGN_DOCUMENT,
                            programmeOwnerId,
                            ministryLevelPermission
                          ) && t('projectDetailsView:orgNotAuth')
                    }
                    overlayClassName="custom-tooltip"
                  >
                    <FileAddOutlined
                      className="common-progress-icon"
                      style={
                        uploadDocUserPermission(
                          userInfoState,
                          DocType.DESIGN_DOCUMENT,
                          programmeOwnerId,
                          ministryLevelPermission
                        )
                          ? {
                              color: '#3F3A47',
                              cursor: 'pointer',
                              margin: '0px 0px 1.5px 0px',
                            }
                          : {
                              color: '#cacaca',
                              cursor: 'default',
                              margin: '0px 0px 1.5px 0px',
                            }
                      }
                      onClick={() =>
                        uploadDocUserPermission(
                          userInfoState,
                          DocType.DESIGN_DOCUMENT,
                          programmeOwnerId,
                          ministryLevelPermission
                        ) && handleDesignDocFileUpload()
                      }
                    />
                  </Tooltip>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".xls, .xlsx, .ppt, .pptx, .csv, .doc, .docx, .pdf, .png, .jpg"
                    onChange={(e: any) => {
                      const selectedFile = e.target.files[0];
                      e.target.value = null;
                      onUploadDocument(selectedFile, DocType.DESIGN_DOCUMENT);
                    }}
                  />
                </>
              )}
            </Col>
          </Row>
          <Row className="field" key="Project Registration Certificate">
            <Col span={18} className="field-key">
              <div className="label-container">
                <div className={designDocUrl !== '' ? 'label-uploaded' : 'label'}>
                  {t('projectDetailsView:registrationCertificate')}
                </div>
                {designDocPending && (designDocActionPermission || ministryLevelPermission) && (
                  <>
                    <LikeOutlined
                      onClick={() => docAction(designDocId, DocumentStatus.ACCEPTED)}
                      className="common-progress-icon"
                      style={{ color: '#976ED7', paddingTop: '3px' }}
                    />
                    <DislikeOutlined
                      onClick={() => {
                        setRejectDocData({ id: designDocId });
                        setActionInfo({
                          action: 'Reject',
                          headerText: `${t('projectDetailsView:rejectDocHeader')}`,
                          text: `${t('projectDetailsView:rejectDocBody')}`,
                          type: 'reject',
                          icon: <DislikeOutlined />,
                        });
                        setOpenRejectDocConfirmationModal(true);
                      }}
                      className="common-progress-icon margin-left-1"
                      style={{ color: '#FD6F70', paddingTop: '3px' }}
                    />
                  </>
                )}
                {designDocStatus === DocumentStatus.ACCEPTED && (
                  <CheckCircleOutlined
                    className="common-progress-icon"
                    style={{ color: '#5DC380', paddingTop: '3px' }}
                  />
                )}
                {designDocStatus === DocumentStatus.REJECTED && (
                  <Tooltip
                    arrowPointAtCenter
                    placement="top"
                    trigger="hover"
                    title={t('projectDetailsView:rejectTip')}
                    overlayClassName="custom-tooltip"
                  >
                    <ExclamationCircleOutlined
                      className="common-progress-icon"
                      style={{ color: '#FD6F70' }}
                    />
                  </Tooltip>
                )}
              </div>
              {designDocUrl !== '' && (
                <div className="time">
                  {moment(parseInt(designDocDate)).format('DD MMMM YYYY @ HH:mm')}
                  {' ~ ' + designDocversion}
                </div>
              )}
            </Col>
            <Col span={6} className="field-value">
              {designDocUrl !== '' ? (
                <div className="link">
                  {linkDocVisible(designDocStatus) && (
                    <a href={designDocUrl} target="_blank" rel="noopener noreferrer" download>
                      <BookOutlined className="common-progress-icon" style={{ color: '#3F3A47' }} />
                    </a>
                  )}
                  {designDocStatus !== DocumentStatus.ACCEPTED && (
                    <>
                      <Tooltip
                        arrowPointAtCenter
                        placement="top"
                        trigger="hover"
                        title={
                          userInfoState?.userRole === Role.ViewOnly ||
                          userInfoState?.companyRole === CompanyRole.CERTIFIER
                            ? t('projectDetailsView:notAuthToUploadDoc')
                            : !uploadDocUserPermission(
                                userInfoState,
                                DocType.DESIGN_DOCUMENT,
                                programmeOwnerId,
                                ministryLevelPermission
                              ) && t('projectDetailsView:orgNotAuth')
                        }
                        overlayClassName="custom-tooltip"
                      >
                        <FileAddOutlined
                          className="common-progress-icon"
                          style={
                            uploadDocUserPermission(
                              userInfoState,
                              DocType.DESIGN_DOCUMENT,
                              programmeOwnerId,
                              ministryLevelPermission
                            )
                              ? {
                                  color: '#3F3A47',
                                  cursor: 'pointer',
                                  margin: '0px 0px 1.5px 0px',
                                }
                              : {
                                  color: '#cacaca',
                                  cursor: 'default',
                                  margin: '0px 0px 1.5px 0px',
                                }
                          }
                          onClick={() =>
                            uploadDocUserPermission(
                              userInfoState,
                              DocType.DESIGN_DOCUMENT,
                              programmeOwnerId,
                              ministryLevelPermission
                            ) && handleDesignDocFileUpload()
                          }
                        />
                      </Tooltip>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".xls, .xlsx, .ppt, .pptx, .csv, .doc, .docx, .pdf, .png, .jpg"
                        onChange={(e: any) => {
                          const selectedFile = e.target.files[0];
                          e.target.value = null;
                          onUploadDocument(selectedFile, DocType.DESIGN_DOCUMENT);
                        }}
                      />
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Tooltip
                    arrowPointAtCenter
                    placement="top"
                    trigger="hover"
                    title={
                      userInfoState?.userRole === Role.ViewOnly ||
                      userInfoState?.companyRole === CompanyRole.CERTIFIER
                        ? t('projectDetailsView:notAuthToUploadDoc')
                        : !uploadDocUserPermission(
                            userInfoState,
                            DocType.DESIGN_DOCUMENT,
                            programmeOwnerId,
                            ministryLevelPermission
                          ) && t('projectDetailsView:orgNotAuth')
                    }
                    overlayClassName="custom-tooltip"
                  >
                    <FileAddOutlined
                      className="common-progress-icon"
                      style={
                        uploadDocUserPermission(
                          userInfoState,
                          DocType.DESIGN_DOCUMENT,
                          programmeOwnerId,
                          ministryLevelPermission
                        )
                          ? {
                              color: '#3F3A47',
                              cursor: 'pointer',
                              margin: '0px 0px 1.5px 0px',
                            }
                          : {
                              color: '#cacaca',
                              cursor: 'default',
                              margin: '0px 0px 1.5px 0px',
                            }
                      }
                      onClick={() =>
                        uploadDocUserPermission(
                          userInfoState,
                          DocType.DESIGN_DOCUMENT,
                          programmeOwnerId,
                          ministryLevelPermission
                        ) && handleDesignDocFileUpload()
                      }
                    />
                  </Tooltip>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".xls, .xlsx, .ppt, .pptx, .csv, .doc, .docx, .pdf, .png, .jpg"
                    onChange={(e: any) => {
                      const selectedFile = e.target.files[0];
                      e.target.value = null;
                      onUploadDocument(selectedFile, DocType.DESIGN_DOCUMENT);
                    }}
                  />
                </>
              )}
            </Col>
          </Row>
        </div>
      </div>
      <RejectDocumentationConfirmationModel
        actionInfo={actionInfo}
        onActionConfirmed={handleOk}
        onActionCanceled={handleCancel}
        openModal={openRejectDocConfirmationModal}
        errorMsg={''}
        loading={loading}
        translator={translator}
      />
    </>
  );
};