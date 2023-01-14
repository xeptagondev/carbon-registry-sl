/* eslint-disable @typescript-eslint/no-unused-expressions */
import { EllipsisOutlined } from '@ant-design/icons';
import {
  Row,
  Checkbox,
  message,
  Tag,
  PaginationProps,
  Col,
  Input,
  Table,
  Empty,
  Popover,
  List,
  Typography,
  Modal,
  Button,
  Form,
} from 'antd';
// import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProfileIcon from '../../Components/ProfileIcon/profile.icon';
import { useConnection } from '../../Context/ConnectionContext/connectionContext';
import {
  CreditTransferStage,
  getStageTransferEnumVal,
  getTransferStageTagType,
} from '../../Definitions/InterfacesAndType/programme.definitions';
import './programmeTransferManagement.scss';
import '../Common/common.table.scss';
import { useUserContext } from '../../Context/UserInformationContext/userInformationContext';

type CompanyInfo = {
  name: string;
  credit: number;
};

const CreditTransfer = () => {
  const navigate = useNavigate();
  const { userInfoState } = useUserContext();
  const { i18n, t } = useTranslation(['common', 'creditTransfer', 'programme']);

  const statusOptions = Object.keys(CreditTransferStage).map((k, index) => ({
    label: Object.values(CreditTransferStage)[index],
    value: k,
  }));

  const [selectedStatus, setSelectedStatus] = useState<any>(statusOptions.map((e) => e.value));
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(true);

  const { post } = useConnection();
  const [totalProgramme, setTotalProgramme] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>();
  const [searchText, setSearchText] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<any>();
  const [sortOrder, setSortOrder] = useState<string>();
  const [sortField, setSortField] = useState<string>();
  const [cancelModalVisible, setCancelModalVisible] = useState<boolean>(false);
  const [acceptModalVisible, setAcceptModalVisible] = useState<any>(false);
  const [rejectModalVisible, setRejectModalVisible] = useState<any>(false);
  const [selectedReqId, setSelectedReqId] = useState<number>();
  const [companiesInfo, setCompaniesInfo] = useState<CompanyInfo[]>();
  const [totalComCredits, setTotalComCredits] = useState<number>(0);
  const [companyIdsVal, setCompanyIdsVal] = useState<number[]>();
  const [creditAmount, setCreditAmount] = useState<number>(0);

  const onStatusQuery = async (checkedValues: CheckboxValueType[]) => {
    console.log(checkedValues);

    if (checkedValues !== selectedStatus) {
      setSelectedStatus(checkedValues);
    }

    if (checkedValues.length === 0) {
      setTableData([]);
      setTotalProgramme(0);
      return;
    }
    setStatusFilter({
      key: 'status',
      operation: 'in',
      value: checkedValues,
    });
  };
  const [formModal] = Form.useForm();
  const { Search } = Input;

  const onCheckAllChange = (e: any) => {
    const nw = e.target.checked ? statusOptions.map((el) => el.value) : [];
    setSelectedStatus(nw);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    onStatusQuery(nw);
  };

  const getAllProgramme = async () => {
    setLoading(true);
    const filter: any[] = [];
    if (statusFilter) {
      filter.push(statusFilter);
    }
    if (search && search !== '') {
      filter.push({
        key: 'programmeTitle',
        operation: 'like',
        value: `${search}%`,
      });
    }

    let sort;
    if (sortOrder && sortField) {
      sort = {
        key: sortField,
        order: sortOrder,
      };
    } else {
      sort = {
        key: 'requestId',
        order: 'ASC',
      };
    }

    try {
      const response: any = await post('national/programme/transferQuery', {
        page: currentPage,
        size: pageSize,
        filterAnd: filter,
        sort: sort,
      });

      console.log(response);
      setTableData(response.data);
      setTotalProgramme(response.response.data.total);
      setLoading(false);
    } catch (error: any) {
      console.log('Error in getting programme transfers', error);
      message.open({
        type: 'error',
        content: error.message,
        duration: 3,
        style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProgramme();
  }, [currentPage, pageSize, statusFilter, sortField, sortOrder, search]);

  const rejectTransfer = async (reqId: number, remarks: string) => {
    setLoading(true);
    try {
      const response: any = await post('national/programme/transferReject', {
        requestId: reqId,
        comment: remarks,
      });
      console.log(response);
      message.open({
        type: 'success',
        content: response.message,
        duration: 3,
        style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
      });
      setRejectModalVisible(false);
      setLoading(false);
      formModal.resetFields();
    } catch (error: any) {
      console.log('Error in getting programme transfers', error);
      message.open({
        type: 'error',
        content: error.message,
        duration: 3,
        style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
      });
      setRejectModalVisible(false);
      setLoading(false);
      formModal.resetFields();
    }
  };

  const acceptRequest = async (record: any) => {
    setLoading(true);
    try {
      const response: any = await post('national/organisation/findByIds', {
        companyIds: record.companyId,
      });
      console.log(response);
      const info = [];
      for (let i = 0; i < record.proponentPercentage.length; i++) {
        info.push({
          credit: (record.proponentPercentage[i] * parseInt(record.creditBalance)) / 100,
          name: response.data.find((v: any) => v.taxId === record.proponentTaxVatId[i]).name,
        });
      }
      setCompaniesInfo(info);
      formModal.resetFields();
      setLoading(false);
    } catch (error: any) {
      console.log('Error in getting companies', error);
      message.open({
        type: 'error',
        content: error.message,
        duration: 3,
        style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
      });
      formModal.resetFields();
      setLoading(false);
    }
  };

  const actionMenu = (record: any) => {
    return userInfoState?.id === record.requesterId.toString() ? (
      <List
        className="action-menu"
        size="small"
        dataSource={[
          {
            text: 'Cancel',
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-clipboard-x"
                viewBox="0 0 16 16"
                color="#FF4C51"
              >
                <path
                  fill-rule="evenodd"
                  d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z"
                />
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            ),
            click: () => {
              setCancelModalVisible(true);
              setAcceptModalVisible(false);
              setRejectModalVisible(false);
              setSelectedReqId(record.requesterId);
            },
          },
        ]}
        renderItem={(item: any) => (
          <List.Item onClick={item.click}>
            <Typography.Text className="action-icon">{item.icon}</Typography.Text>
            <span>{item.text}</span>
          </List.Item>
        )}
      />
    ) : (
      <List
        className="action-menu"
        size="small"
        dataSource={[
          {
            text: 'Accept',
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-hand-thumbs-up"
                viewBox="0 0 16 16"
                color="#16B1FF"
              >
                <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
              </svg>
            ),
            click: () => {
              setAcceptModalVisible(true);
              setRejectModalVisible(false);
              setCancelModalVisible(false);
              console.log('kkkkkk', record.requestId);
              setSelectedReqId(record.requestId);
              setTotalComCredits(record.creditBalance);
              setCompanyIdsVal(record.companyId);
              setCreditAmount(record.creditAmount);
              acceptRequest(record);
            },
          },
          {
            text: 'Reject',
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-x-circle"
                viewBox="0 0 16 16"
                color="#FF4C51"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            ),
            click: () => {
              setRejectModalVisible(true);
              setCancelModalVisible(false);
              setAcceptModalVisible(false);
              setSelectedReqId(record.requestId);
            },
          },
        ]}
        renderItem={(item: any) => (
          <List.Item onClick={item.click}>
            <Typography.Text className="action-icon">{item.icon}</Typography.Text>
            <span>{item.text}</span>
          </List.Item>
        )}
      />
    );
  };

  const columns = [
    {
      title: t('creditTransfer:requestID'),
      dataIndex: 'requestId',
      key: 'requestId',
      sorter: true,
      align: 'center' as const,
      render: (item: any) => {
        return <span className="clickable">{item}</span>;
      },
    },
    {
      title: t('creditTransfer:date'),
      key: 'txTime',
      sorter: true,
      align: 'left' as const,
      render: (item: any, itemObj: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {DateTime.fromMillis(parseInt(itemObj.txTime)).toFormat('dd LLLL yyyy')}
          </div>
        );
      },
    },
    {
      title: t('creditTransfer:pName'),
      dataIndex: 'programmeTitle',
      key: 'programmeTitle',
      sorter: true,
      align: 'left' as const,
    },
    {
      title: t('creditTransfer:sector'),
      dataIndex: 'programmeSector',
      key: 'programmeSector',
      sorter: true,
      align: 'left' as const,
    },
    {
      title: t('creditTransfer:certifier'),
      dataIndex: 'certifier',
      key: 'certifier',
      sorter: true,
      align: 'left' as const,
      render: (item: any, itemObj: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {itemObj.certifier &&
              itemObj.certifier.map((v: any, i: any) => {
                return <ProfileIcon icon={v.logo} bg="rgba(128, 255, 0, 0.12)" name={v.name} />;
              })}
          </div>
        );
      },
    },
    {
      title: t('creditTransfer:initiator'),
      key: 'initiator',
      sorter: true,
      align: 'left' as const,
      render: (item: any, itemObj: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {itemObj.requester.map((v: any, i: any) => {
              return <ProfileIcon icon={v.logo} bg="rgba(128, 255, 0, 0.12)" name={v.name} />;
            })}
          </div>
        );
      },
    },
    {
      title: t('creditTransfer:cSender'),
      key: 'cSender',
      sorter: true,
      align: 'left' as const,
      render: (item: any, itemObj: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {itemObj.sender.map((v: any, i: any) => {
              return <ProfileIcon icon={v.logo} bg="rgba(128, 255, 0, 0.12)" name={v.name} />;
            })}
          </div>
        );
      },
    },
    {
      title: t('creditTransfer:cReceiver'),
      dataIndex: 'requester',
      key: 'requester',
      sorter: true,
      align: 'left' as const,
      render: (item: any, itemObj: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {itemObj.requester.map((v: any, i: any) => {
              return <ProfileIcon icon={v.logo} bg="rgba(128, 255, 0, 0.12)" name={v.name} />;
            })}
          </div>
        );
      },
    },
    {
      title: t('creditTransfer:cRequested'),
      dataIndex: 'creditAmount',
      key: 'creditAmount',
      sorter: true,
      align: 'left' as const,
      render: (item: any) => {
        return <span className="clickable">{item}</span>;
      },
    },
    {
      title: t('creditTransfer:cBalance'),
      dataIndex: 'creditBalance',
      key: 'creditBalance',
      sorter: true,
      align: 'left' as const,
      render: (item: any) => {
        return <span>{item}</span>;
      },
    },
    {
      title: t('programme:status'),
      key: 'currentStage',
      sorter: true,
      align: 'center' as const,
      render: (item: any, Obj: any) => {
        return (
          <Tag className="clickable" color={getTransferStageTagType(Obj.status)}>
            {getStageTransferEnumVal(Obj.status)}
          </Tag>
        );
      },
    },
    {
      align: 'right' as const,
      render: (_: any, record: any) => {
        return (
          <Popover placement="bottomRight" content={actionMenu(record)} trigger="click">
            <EllipsisOutlined
              rotate={90}
              style={{ fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
            />
          </Popover>
        );
      },
      // render: () => {
      //   return (
      //     <div className="clickable">
      //       <MoreOutlined style={{ fontSize: '20px' }} />
      //     </div>
      //   );
      // },
    },
  ];

  const onSearch = async () => {
    setSearch(searchText);
  };

  const onChange: PaginationProps['onChange'] = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleTableChange = (pag: any, sorter: any) => {
    console.log(pag, sorter);
    setSortOrder(
      sorter.order === 'ascend' ? 'ASC' : sorter.order === 'descend' ? 'DESC' : undefined
    );
    setSortField(sorter.columnKey);
    // setCurrentPage(1);
  };

  const handleOk = (val: any) => {
    console.log(val);
    selectedReqId !== undefined && rejectTransfer(selectedReqId, val.remarks);
    formModal.resetFields();
    setSelectedReqId(undefined);
  };

  const handleCancel = () => {
    setRejectModalVisible(false);
    formModal.resetFields();
    setSelectedReqId(undefined);
  };

  const handleCancelOk = () => {
    // deleteUser(deleteUserModalRecord);
    formModal.resetFields();
    setCancelModalVisible(false);
  };

  const handleCancelCancel = () => {
    formModal.resetFields();
    setCancelModalVisible(false);
  };

  const acceptRequestApi = async (comCredits: any, remarks: any) => {
    console.log(comCredits, 'lll', companyIdsVal, 'llllll', selectedReqId);
    setLoading(true);
    try {
      const response: any = await post('national/programme/transferApprove', {
        requestId: selectedReqId,
        comment: remarks,
        companyIds: companyIdsVal,
        companyCredit: comCredits,
      });
      console.log(response);
      message.open({
        type: 'success',
        content: response.message,
        duration: 3,
        style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
      });
      setAcceptModalVisible(false);
      setLoading(false);
      formModal.resetFields();
    } catch (error: any) {
      console.log('Error in approving credit transfers', error);
      message.open({
        type: 'error',
        content: error.message,
        duration: 3,
        style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
      });
      setAcceptModalVisible(false);
      setLoading(false);
      formModal.resetFields();
    }
  };

  const handleAcceptOk = (val: any) => {
    const arr = [];
    for (const key in val) {
      if (key.startsWith('credits') && val[key] !== undefined) {
        arr.push(parseInt(val[key]));
      } else if (key.startsWith('credits') && val[key] === undefined) {
        arr.push(0);
      }
    }
    const sum = arr.reduce((a, b) => a + b, 0);
    if (sum === creditAmount) {
      acceptRequestApi(arr, val.remarksApprove);
      formModal.resetFields();
      setAcceptModalVisible(false);
    } else {
      message.open({
        type: 'error',
        content: 'Sum of credits should be equal to total requested credits',
        duration: 3,
        style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
      });
    }
  };

  const handleAcceptCancel = () => {
    console.log(companiesInfo);
    formModal.resetFields();
    setAcceptModalVisible(false);
  };

  return (
    <div className="content-container programme-management">
      <div className="title-bar">
        <div className="body-title">{t('creditTransfer:viewCreditsTransfers')}</div>
        <div className="body-sub-title">{t('creditTransfer:desc')}</div>
      </div>
      <div className="content-card">
        <Row>
          <Col lg={{ span: 16 }} md={{ span: 16 }}>
            <div className="action-bar">
              <Checkbox
                className="all-check"
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
                defaultChecked={true}
              >
                All
              </Checkbox>
              <Checkbox.Group
                options={statusOptions}
                defaultValue={statusOptions.map((e) => e.value)}
                value={selectedStatus}
                onChange={onStatusQuery}
              />
            </div>
          </Col>
          <Col lg={{ span: 8 }} md={{ span: 8 }}>
            <div className="filter-section">
              <div className="search-bar">
                <Search
                  onPressEnter={onSearch}
                  placeholder={'Search by programme name'}
                  allowClear
                  onChange={(e) => setSearchText(e.target.value)}
                  onSearch={setSearch}
                  style={{ width: 265 }}
                />
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className="programmeManagement-table-container">
              <Table
                dataSource={tableData}
                columns={columns}
                className="common-table-class"
                loading={loading}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalProgramme,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  onChange: onChange,
                }}
                onChange={(val: any, filter: any, sorter: any) => handleTableChange(val, sorter)}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={tableData.length === 0 ? t('creditTransfer:noTransfer') : null}
                    />
                  ),
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
      <Modal
        centered
        title=""
        okText="REJECT"
        open={rejectModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="delete-modal-container">
          <div className="confirm-message-details">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100"
                height="100"
                fill="currentColor"
                className="bi bi-envelope-slash"
                viewBox="0 0 16 16"
                color="#FF4C51"
              >
                <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z" />
                <path d="M14.975 10.025a3.5 3.5 0 1 0-4.95 4.95 3.5 3.5 0 0 0 4.95-4.95Zm-4.243.707a2.501 2.501 0 0 1 3.147-.318l-3.465 3.465a2.501 2.501 0 0 1 .318-3.147Zm.39 3.854 3.464-3.465a2.501 2.501 0 0 1-3.465 3.465Z" />
              </svg>
            </div>
            <div className="content">Are you sure you want to reject this project?</div>
            <div className="sub-content">You can’t undo this action</div>
          </div>
          <div className="remarks">
            <Form
              name="delete-modal-details"
              className="delete-modal-form"
              layout={'vertical'}
              requiredMark={true}
              form={formModal}
              onFinish={handleOk}
            >
              <Form.Item
                className="remarks-label"
                label="Remarks"
                name="remarks"
                rules={[
                  {
                    required: true,
                    message: 'Remarks is required!',
                  },
                ]}
              >
                <Input.TextArea placeholder="" />
              </Form.Item>
              <Form.Item>
                <div className="delete-modal-btns">
                  <div className="center width-60">
                    <Button onClick={handleCancel}>CANCEL</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      REJECT
                    </Button>
                  </div>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
      <Modal
        centered
        title=""
        okText="CANCEL"
        open={cancelModalVisible}
        onOk={handleCancelOk}
        onCancel={handleCancelCancel}
        footer={null}
      >
        <div className="delete-modal-container">
          <div className="confirm-message-details">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                color="#FF4C51"
                width="100"
                height="100"
                fill="currentColor"
                className="bi bi-clipboard-x"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z"
                />
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            </div>
            <div className="content">Are you sure you want to cancel this request?</div>
            <div className="sub-content">You can’t undo this action</div>
          </div>
          <div className="remarks">
            <Form
              name="delete-modal-details"
              className="delete-modal-form"
              layout={'vertical'}
              requiredMark={true}
              form={formModal}
              onFinish={handleCancelOk}
            >
              <Form.Item
                className="remarks-label"
                label="Remarks"
                name="remarks"
                rules={[
                  {
                    required: true,
                    message: 'Remarks is required!',
                  },
                ]}
              >
                <Input.TextArea placeholder="" />
              </Form.Item>
              <Form.Item>
                <div className="delete-modal-btns">
                  <div className="center width-60">
                    <Button onClick={handleCancelCancel}>CANCEL</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      REJECT
                    </Button>
                  </div>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
      <Modal
        centered
        title=""
        okText="APPROVE"
        open={acceptModalVisible}
        onOk={handleAcceptOk}
        onCancel={handleAcceptCancel}
        footer={null}
      >
        <div className="delete-modal-container">
          <div className="confirm-message-details">
            <div className="content">Accept Transfer Request</div>
          </div>
          <div className="remarks">
            <Form
              name="delete-modal-details"
              className="delete-modal-form"
              layout={'vertical'}
              requiredMark={true}
              form={formModal}
              onFinish={handleAcceptOk}
            >
              {companiesInfo?.length !== 0 &&
                !loading &&
                companiesInfo?.map((v: any, i: any) => {
                  return (
                    <Row>
                      <Col offset={1} span={8}>
                        <Form.Item className="remarks-label" name="companyName">
                          {v.name}
                        </Form.Item>
                      </Col>
                      <Col offset={1} span={5}>
                        <Form.Item
                          className="remarks-label"
                          name={'credits' + i}
                          rules={[
                            {
                              pattern: new RegExp(/^[+]?([.]\d+|\d+[.]?\d*)$/g),
                              message: 'Credit Should be a positive number',
                            },
                            ({ getFieldValue }) => ({
                              validator(rule, value) {
                                if (getFieldValue('credits' + i) > v.credit) {
                                  // eslint-disable-next-line prefer-promise-reject-errors
                                  return Promise.reject(
                                    'Credit amount should not be greater than company credit'
                                  );
                                } else if (getFieldValue('credits' + i) > creditAmount) {
                                  // eslint-disable-next-line prefer-promise-reject-errors
                                  return Promise.reject(
                                    'Credit amount should not be greater than requested credit Amount'
                                  );
                                }
                                return Promise.resolve();
                              },
                            }),
                          ]}
                        >
                          <Input placeholder="" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <div
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                          }}
                        >
                          <span>/</span>
                        </div>
                      </Col>
                      <Col span={4}>
                        <Form.Item className="remarks-label" name="totalCredit">
                          <Input placeholder={v.credit} disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                })}
              <Row>
                <Col offset={1} span={8}>
                  <Form.Item className="remarks-label" name="companyName">
                    Requested Amount
                  </Form.Item>
                </Col>
                <Col offset={1} span={5}>
                  <Form.Item className="remarks-label" name="totalRequest">
                    <Input placeholder={creditAmount.toString()} disabled />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <div
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  >
                    <span>/</span>
                  </div>
                </Col>
                <Col span={4}>
                  <Form.Item className="remarks-label" name="totalCredit">
                    <Input placeholder={parseInt(totalComCredits.toString()).toString()} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col offset={1} span={22}>
                  <Form.Item
                    className="remarks-label"
                    label="Remarks"
                    name="remarksApprove"
                    rules={[
                      {
                        required: true,
                        message: 'Remarks is required!',
                      },
                    ]}
                  >
                    <Input.TextArea placeholder="" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <div className="delete-modal-btns">
                  <div className="center width-60">
                    <Button onClick={handleAcceptCancel}>CANCEL</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      ACCEPT
                    </Button>
                  </div>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreditTransfer;
