import React, { useEffect, useState } from 'react';
import { ValidationStepsProps } from './StepProps';
import {
  Row,
  Button,
  Form,
  Col,
  Input,
  Checkbox,
  Table,
  TableProps,
  Select,
  DatePicker,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { InfoCircleOutlined, MinusOutlined } from '@ant-design/icons';
import NetEmissionReduction from '../Common/NetEmissonReduction';
import { ProcessSteps } from './ValidationStepperComponent';

// enum netEmissionColumnType {
//   TOTAL = 'TOTAL',
//   TOTAL_CREDITING_YEARS = 'TOTAL_CREDITING_YEARS',
//   ANNUAL_AVERAGE = 'ANNUAL_AVERAGE',
// }

const DataValidationProcess = (props: ValidationStepsProps) => {
  const { prev, next, form, current, t, countries, handleValuesUpdate, existingFormValues } = props;

  const emptyBackgroundInvestigationRow = {
    backgroundInvestigationName: '',
    backgroundInvestigationDesignation: '',
    backgroundInvestigationOganizationEntity: '',
    backgroundInvestigationMethodTelephone: '',
  };

  const emptyEmployedTechnologyDataSourceRow = {
    employedTechnologySiteNo: '',
    employedTechnologyLocation: ``,
    employedTechnologyCapacity: '',
  };

  const baselineEmissionDataSourceList = [
    {
      type: 'unit',
      location: t('units'),
      projectCapacity: '',
      plantFactor: '',
      averageEnergyOutput: '',
      gridEmissionFactor: '',
      emissionReduction: '',
    },
  ];

  const estimatedNetEmissionDataSourceList = [
    {
      type: 'YEAR',
      year: {
        start: '',
        end: '',
      },
      estimatedBaselineEmissionsOrRemovals: '',
      estimatedProjectEmissionsOrRemovals: '',
      estimatedLeakageEmissions: '',
      estimatedNetGhgEmissionReductionsOrRemovals: '',
    },
  ];

  const estimatedNetEmissionTotalDataSourceList = [
    {
      type: 'TOTAL',
      label: t('total'),
      estimatedBaselineEmissionsOrRemovals: '',
      estimatedProjectEmissionsOrRemovals: '',
      estimatedLeakageEmissions: '',
      estimatedNetGhgEmissionReductionsOrRemovals: '',
    },
    {
      type: 'TOTAL_CREDITING_YEARS',
      label: t('totalNumberOfCreditingYears'),
      estimatedBaselineEmissionsOrRemovals: '',
      estimatedProjectEmissionsOrRemovals: '',
      estimatedLeakageEmissions: '',
      estimatedNetGhgEmissionReductionsOrRemovals: '',
    },
    {
      type: 'ANNUAL_AVERAGE',
      label: t('annualAverage'),
      estimatedBaselineEmissionsOrRemovals: '',
      estimatedProjectEmissionsOrRemovals: '',
      estimatedLeakageEmissions: '',
      estimatedNetGhgEmissionReductionsOrRemovals: '',
    },
  ];

  const [baselineEmissionDataSource, setBaselineEmissionDataSource] = useState([]);

  const [employedTechnologyDataSource, setEmployedTechnologyDataSource] = useState([
    emptyEmployedTechnologyDataSourceRow,
  ]);

  const [estimatedNetEmissionDataSource, setEstimatedNetEmissionDataSource] = useState([]);

  const requiredRule = [{ required: true, message: t('common:isRequired') }];

  const removeEmployedTechnology = (index: number) => {
    setEmployedTechnologyDataSource((prevATM) => {
      const newList = [...prevATM];
      newList.splice(index, 1);
      return newList;
    });
  };

  const calculateCapacity = () => {
    const empTechnology = form.getFieldValue('employedTechnology') as any[];
    const totalCap = empTechnology?.reduce((total, currentVal) => {
      return total + Number(currentVal.capacity);
    }, 0);
    form.setFieldValue('totalCapacity', `${totalCap} kWp`);
  };

  // useEffect(() => {

  // }, [employedTechnologyDataSource]);

  const employedTechnologyTableColumns: TableProps<any>['columns'] = [
    {
      title: t('validationReport:siteNo'),
      dataIndex: 'employedTechnologySiteNo',
      key: 'employedTechnologySiteNo',
      render: (_: any, record: any, index: number) => (
        <Form.Item name={['employedTechnology', index, 'siteNo']} rules={requiredRule}>
          <Input size="large" />
        </Form.Item>
      ),
    },
    {
      title: t('validationReport:location'),
      dataIndex: 'employedTechnologyLocation',
      key: 'employedTechnologyLocation',
      render: (_: any, record: any, index: number) => (
        <Form.Item name={['employedTechnology', index, 'location']} rules={requiredRule}>
          <Input size="large" />
        </Form.Item>
      ),
    },
    {
      title: t('validationReport:capacityKwp'),
      dataIndex: 'employedTechnologyCapacity',
      key: 'employedTechnologyCapacity',
      render: (_: any, record: any, index: number) => (
        <Form.Item name={['employedTechnology', index, 'capacity']} rules={requiredRule}>
          <Input size="large" onChange={calculateCapacity} />
        </Form.Item>
      ),
    },
    {
      title: '',
      dataIndex: 'employedTechnologyRemove',
      key: 'employedTechnologyRemove',
      render: (_: any, record: any, index: number) => {
        return employedTechnologyDataSource.length > 1 ? (
          <Button
            // type="dashed"
            onClick={() => {
              removeEmployedTechnology(index);
              calculateCapacity();
            }}
            size="middle"
            className="addMinusBtn"
            // block
            icon={<MinusOutlined />}
          ></Button>
        ) : (
          <span></span>
        );
      },
    },
  ];

  const applicabilityTableColumns: TableProps<any>['columns'] = [
    {
      title: t('validationReport:no'),
      dataIndex: 'applicabilityNo',
      key: 'applicabilityNo',
      width: '20px',
    },
    {
      title: t('validationReport:applicabilityCriteria'),
      dataIndex: 'applicabilityCriteria',
      key: 'applicabilityCriteria',
      width: '300px',
    },
    {
      title: t('validationReport:projectActivity'),
      dataIndex: 'projectActivity',
      key: 'projectActivity',
      width: '300px',
      render: (_: any, record: any, index: number) => (
        <Form.Item
          name={['methodologyCriteriaApplicability', index, 'projectActivity']}
          rules={requiredRule}
        >
          <Input size="large" />
        </Form.Item>
      ),
    },
    {
      title: t('validationReport:applicabilityCriteriaMet'),
      dataIndex: 'applicabilityCriteriaMet',
      key: 'applicabilityCriteriaMet',
      width: '100px',
      render: (_: any, record: any, index: number) => (
        <Form.Item
          name={['methodologyCriteriaApplicability', index, 'criteriaMet']}
          rules={requiredRule}
        >
          <Select>
            <Select.Option value="yes">{t('yes')}</Select.Option>
            <Select.Option value="no">{t('no')}</Select.Option>
            <Select.Option value="na">{t('notApplicable')}</Select.Option>
          </Select>
        </Form.Item>
      ),
    },
  ];

  const applicabilityTableDataSource = [
    {
      applicabilityNo: '01',
      applicabilityCriteria: [
        t('validationReport:criteria1'),
        `(a) ${t('validationReport:criteria1A')}`,
        `(b) ${t('validationReport:criteria1B')}`,
      ],
      projectActivity: '',
      applicabilityCriteriaMet: '',
    },
    {
      applicabilityNo: '02',
      applicabilityCriteria: [t('validationReport:criteria2')],
      projectActivity: '',
      applicabilityCriteriaMet: '',
    },
    {
      applicabilityNo: '03',
      applicabilityCriteria: [t('validationReport:criteria3')],
      projectActivity: '',
      applicabilityCriteriaMet: '',
    },
    {
      applicabilityNo: '04',
      applicabilityCriteria: [
        t('validationReport:criteria4'),
        <ul>
          <li>{t('validationReport:criteria4A')}</li>
          <li>{t('validationReport:criteria4B')}</li>
          <li>{t('validationReport:criteria4C')}</li>
        </ul>,
      ],
      projectActivity: '',
      applicabilityCriteriaMet: '',
    },
    {
      applicabilityNo: '05',
      applicabilityCriteria: [t('validationReport:criteria5')],
      projectActivity: '',
      applicabilityCriteriaMet: '',
    },
    {
      applicabilityNo: '06',
      applicabilityCriteria: [t('validationReport:criteria6')],
      projectActivity: '',
      applicabilityCriteriaMet: '',
    },
    {
      applicabilityNo: '07',
      applicabilityCriteria: [t('validationReport:criteria7')],
      projectActivity: '',
      applicabilityCriteriaMet: '',
    },
    {
      applicabilityNo: '08',
      applicabilityCriteria: [t('validationReport:criteria8')],
      projectActivity: '',
      applicabilityCriteriaMet: '',
    },
    {
      applicabilityNo: '09',
      applicabilityCriteria: [t('validationReport:criteria9')],
      projectActivity: '',
      applicabilityCriteriaMet: '',
    },
    {
      applicabilityNo: '10',
      applicabilityCriteria: [t('validationReport:criteria10')],
      projectActivity: '',
      applicabilityCriteriaMet: '',
    },
  ];

  const baselineEmissionTableColumns: TableProps<any>['columns'] = [
    {
      title: '',
      dataIndex: 'baselineEmissionLocation',
      key: 'baselineEmissionLocation',
      render: (_: any, record: any, index: number) =>
        index === 0 ? (
          <p>{t('units')}</p>
        ) : (
          <Form.Item name={['baselineEmission', index, 'location']} rules={requiredRule}>
            <Input size="large" disabled />
          </Form.Item>
        ),
    },
    {
      title: t('validationReport:projectCapacity'),
      dataIndex: 'baselineEmissionProjectCapacity',
      key: 'baselineEmissionProjectCapacity',
      render: (_: any, record: any, index: number) => (
        <Form.Item name={['baselineEmission', index, 'projectCapacity']} rules={requiredRule}>
          <Input size="large" disabled={index === 0 ? true : false} />
        </Form.Item>
      ),
    },
    {
      title: t('validationReport:plantFactor'),
      dataIndex: 'baselineEmissionPlantFactor',
      key: 'baselineEmissionPlantFactor',
      render: (_: any, record: any, index: number) => (
        <Form.Item name={['baselineEmission', index, 'plantFactor']} rules={requiredRule}>
          <Input size="large" disabled={index === 0 ? true : false} />
        </Form.Item>
      ),
    },
    {
      title: t('validationReport:averageEnergyOutput'),
      dataIndex: 'baselineEmissionAverageEnergyOutput',
      key: 'baselineEmissionAverageEnergyOutput',
      render: (_: any, record: any, index: number) => (
        <Form.Item name={['baselineEmission', index, 'averageEnergyOutput']} rules={requiredRule}>
          <Input size="large" disabled={index === 0 ? true : false} />
        </Form.Item>
      ),
    },
    {
      title: t('validationReport:gridEmissionFactor'),
      dataIndex: 'baselineEmissionGridEmissionFactor',
      key: 'baselineEmissionGridEmissionFactor',
      render: (_: any, record: any, index: number) => (
        <Form.Item name={['baselineEmission', index, 'gridEmissionFactor']} rules={requiredRule}>
          <Input size="large" disabled={index === 0 ? true : false} />
        </Form.Item>
      ),
    },
    {
      title: t('validationReport:emissionReduction'),
      dataIndex: 'baselineEmissionEmissionReduction',
      key: 'baselineEmissionEmissionReduction',
      render: (_: any, record: any, index: number) => (
        <Form.Item name={['baselineEmission', index, 'emissionReduction']} rules={requiredRule}>
          <Input size="large" disabled={index === 0 ? true : false} />
        </Form.Item>
      ),
    },
  ];

  const estimatedNetEmissionTableColumns: TableProps<any>['columns'] = [
    {
      title: t('validationReport:year'),
      dataIndex: 'year',
      key: 'year',
      render: (_: any, record: any, index: number) => (
        <>
          <span>{record?.year?.start}</span>
          <span>{record?.year?.end}</span>
        </>
      ),
    },
    {
      title: t('validationReport:estimatedBaselineEmissionsOrRemovals'),
      dataIndex: 'estimatedBaselineEmissionsOrRemovals',
      key: 'estimatedBaselineEmissionsOrRemovals',
      render: (_: any, record: any, index: number) => (
        <Form.Item
          name={['dvpEstimatedNetEmission', index, 'estimatedBaselineEmissionsOrRemovals']}
          rules={requiredRule}
        >
          <Input size="large" />
        </Form.Item>
      ),
    },
    {
      title: t('validationReport:estimatedProjectEmissionsOrRemovals'),
      dataIndex: 'estimatedProjectEmissionsOrRemovals',
      key: 'estimatedProjectEmissionsOrRemovals',
      render: (_: any, record: any, index: number) => (
        <Form.Item
          name={['dvpEstimatedNetEmission', index, 'estimatedProjectEmissionsOrRemovals']}
          rules={requiredRule}
        >
          <Input size="large" />
        </Form.Item>
      ),
    },
    {
      title: t('validationReport:estimatedLeakageEmissions'),
      dataIndex: 'estimatedLeakageEmissions',
      key: 'estimatedLeakageEmissions',
      render: (_: any, record: any, index: number) => (
        <Form.Item
          name={['dvpEstimatedNetEmission', index, 'estimatedLeakageEmissions']}
          rules={requiredRule}
        >
          <Input size="large" />
        </Form.Item>
      ),
    },
    {
      title: t('validationReport:estimatedNetGhgEmissionReductionsOrRemovals'),
      dataIndex: 'estimatedNetGhgEmissionReductionsOrRemovals',
      key: 'estimatedNetGhgEmissionReductionsOrRemovals',
      render: (_: any, record: any, index: number) => (
        <Form.Item
          name={['dvpEstimatedNetEmission', index, 'estimatedNetGhgEmissionReductionsOrRemovals']}
          rules={requiredRule}
        >
          <Input size="large" />
        </Form.Item>
      ),
    },
  ];

  const onFinish = async (values: any) => {
    const dataValidationProcessFormValues: any = {
      generalDescription: values?.generalDescription,
      employedTechnology: values?.employedTechnology,
      totalCapacityDescription: values?.totalCapacityDescription,
      projectApprovals: values?.projectApprovals,
      titleAndReference: values?.titleAndReference,
      applicability: values?.applicability,
      methodologyCriteriaApplicability: values?.methodologyCriteriaApplicability,
      projectBoundary: values?.projectBoundary,
      baselineIdentification: values?.baselineIdentification,
      forumulaUsedInEmissionReduction: values?.forumulaUsedInEmissionReduction,
      calculationOfBaselineEmissionFactor: values?.calculationOfBaselineEmissionFactor,
      plantFactor: values?.plantFactor,
      annualEmissionReductionCalculation: values?.annualEmissionReductionCalculation,
      baselineEmission: values?.baselineEmission,
      projectEmission: values?.projectEmission,
      extraEmissionReductions: values?.extraEmissionReductions, //check
      methodologyDeviations: values?.methodologyDeviations,
      monitoringPlan: values?.monitoringPlan,
      carbonManagementAssessment: values?.carbonManagementAssessment,
      changesOfTheProjectActivity: values?.changesOfTheProjectActivity,
      environmentImpact: values?.environmentImpact,
      commentsOfStakeholders: values?.commentsOfStakeholders,
    };

    console.log(ProcessSteps.VR_VALIDATION_PROCESS, dataValidationProcessFormValues);
    handleValuesUpdate({ [ProcessSteps.VR_VALIDATION_PROCESS]: dataValidationProcessFormValues });
  };

  return (
    <>
      {current === 4 && (
        <div>
          <div className="val-report-step-form-container">
            <Form
              labelCol={{ span: 20 }}
              wrapperCol={{ span: 24 }}
              className="step-form"
              layout="vertical"
              requiredMark={true}
              form={form}
              validateTrigger={false}
              onFinish={(values: any) => {
                // onFinish(values);
                if (next) {
                  next();
                }
              }}
            >
              <h4>4.1 {t('validationReport:projectDetails')}</h4>

              <Col md={24} xl={24}>
                <Form.Item
                  label={`4.1.1 ${t('validationReport:generalDescription')}`}
                  name="generalDescription"
                  rules={[
                    {
                      required: true,
                      message: `${t('validationReport:generalDescription')} ${t('isRequired')}`,
                    },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                  label={`4.1.2 ${t('validationReport:employedTechnology')}`}
                  rules={[
                    {
                      required: true,
                      message: `${t('validationReport:employedTechnology')} ${t('isRequired')}`,
                    },
                  ]}
                >
                  <Row>
                    <Col span={24}>
                      <Table
                        pagination={false}
                        dataSource={employedTechnologyDataSource}
                        columns={employedTechnologyTableColumns}
                      ></Table>
                    </Col>
                    <Col
                      span={24}
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: 10,
                      }}
                    >
                      <Button
                        size={'large'}
                        onClick={() => {
                          setEmployedTechnologyDataSource((prevATM) => {
                            return [...prevATM, emptyEmployedTechnologyDataSourceRow];
                          });
                        }}
                      >
                        {t('validationReport:addRow')}
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>

              <Row>
                <Col span={16}>{t('validationReport:totalCapacity')}</Col>
                <Col span={7}>
                  <Form.Item name="totalCapacity">
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={60}>
                <Col md={24} xl={24}>
                  <Form.Item
                    name="totalCapacityDescription"
                    rules={[
                      {
                        required: true,
                        message: `${t('validationReport:publicReview')} ${t('isRequired')}`,
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>

                  <Form.Item
                    label={`4.2 ${t('validationReport:approvals')}`}
                    name="projectApprovals"
                    rules={[
                      {
                        required: true,
                        message: `${t('validationReport:approvals')} ${t('isRequired')}`,
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                </Col>
                <Col>
                  <h4>4.3 {t('validationReport:applicationofMethodology')}</h4>
                  <Form.Item
                    label={`4.3.1 ${t('validationReport:titleandreference')}`}
                    name="titleAndReference"
                    rules={[
                      {
                        required: true,
                        message: `${t('validationReport:onSiteInspection')} ${t('isRequired')}`,
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>

                  <Form.Item
                    label={`4.3.2 ${t('validationReport:applicability')}`}
                    name="applicability"
                    rules={[
                      {
                        required: true,
                        message: `${t('validationReport:applicability')} ${t('isRequired')}`,
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>

                  <Table
                    dataSource={applicabilityTableDataSource}
                    columns={applicabilityTableColumns}
                  ></Table>

                  <Form.Item
                    label={`4.3.3 ${t('validationReport:projectBoundary')}`}
                    name="projectBoundary"
                    rules={[
                      {
                        required: true,
                        message: `${t('validationReport:projectBoundary')} ${t('isRequired')}`,
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <Form.Item
                    label={`4.3.4 ${t('validationReport:baselineIdentification')}`}
                    name="baselineIdentification"
                    rules={[
                      {
                        required: true,
                        message: `${t('validationReport:baselineIdentification')} ${t(
                          'isRequired'
                        )}`,
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <Form.Item
                    label={`4.3.5 ${t('validationReport:forumulaUserInEmissionReduction')}`}
                    name="forumulaUsedInEmissionReduction"
                    rules={[
                      {
                        required: true,
                        message: `${t('validationReport:forumulaUserInEmissionReduction')} ${t(
                          'isRequired'
                        )}`,
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>

                  <h4>
                    4.3.6 {t('validationReport:quantificationOfGhgEmissionReductionsAndRemoval')}
                  </h4>
                  <Form.Item
                    label={`${t('validationReport:calculationOfBaselineEmissionFactor')}`}
                    name="calculationOfBaselineEmissionFactor"
                    rules={[
                      {
                        required: true,
                        message: `${t('validationReport:calculationOfBaselineEmissionFactor')} ${t(
                          'isRequired'
                        )}`,
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  {/* TODO: sss */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span>{t('validationReport:gridEmissionFactorEfcmGridY')}</span>
                    <div style={{ width: '150px' }}>
                      <Input disabled value={0.72222} />
                    </div>
                    <div style={{ width: '150px' }}>
                      <Input value={'tCO2e/MWh'} disabled />
                    </div>
                    <div style={{ width: '190px' }}>
                      <Input value={'Published by SLSEA (2020)'} disabled />
                    </div>
                  </div>
                  <Form.Item
                    label={`${t('validationReport:plantFactor')}`}
                    name="plantFactor"
                    rules={[
                      {
                        required: true,
                        message: `${t('validationReport:plantFactor')} ${t('isRequired')}`,
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <Form.Item
                    label={`${t('validationReport:annualEmissionReductionCalculation')}`}
                    name="annualEmissionReductionCalculation"
                    rules={[
                      {
                        required: true,
                        message: `${t('validationReport:annualEmissionReductionCalculation')} ${t(
                          'isRequired'
                        )}`,
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <Form.Item
                    label={`${t('validationReport:baselineEmission')}`}
                    rules={[
                      {
                        required: true,
                        message: `${t('validationReport:annualEmissionReductionCalculation')} ${t(
                          'isRequired'
                        )}`,
                      },
                    ]}
                  >
                    <Table
                      dataSource={baselineEmissionDataSource}
                      columns={baselineEmissionTableColumns}
                      pagination={false}
                    ></Table>
                  </Form.Item>

                  <Form.Item
                    label={`${t('validationReport:projectEmission')}`}
                    name="projectEmission"
                    rules={[
                      {
                        required: true,
                        message: `${t('validationReport:projectEmission')} ${t('isRequired')}`,
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>

                  <Form.Item
                    label={`${t('validationReport:estimatedNetEmissionReduction')}`}
                    name="estimatedNetEmissionReduction"
                    rules={[
                      {
                        required: true,
                        message: `${t('validationReport:estimatedNetEmissionReduction')} ${t(
                          'isRequired'
                        )}`,
                      },
                    ]}
                  >
                    {/* <Table
                      dataSource={estimatedNetEmissionDataSourceList}
                      columns={estimatedNetEmissionTableColumns}
                    ></Table> */}
                    <NetEmissionReduction form={form} t={t}></NetEmissionReduction>
                  </Form.Item>
                  <Form.Item
                    label={`4.3.7 ${t('validationReport:methodologyDeviations')}`}
                    name="methodologyDeviations"
                    rules={[
                      {
                        required: true,
                        message: `${t('validationReport:projectEmission')} ${t('isRequired')}`,
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <Form.Item
                    label={`4.3.8 ${t('validationReport:monitoringPlan')}`}
                    name="monitoringPlan"
                    rules={[
                      {
                        required: true,
                        message: `${t('validationReport:monitoringPlan')} ${t('isRequired')}`,
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <Form.Item
                    label={`4.4 ${t('validationReport:carbonManagementAssessment')}`}
                    name="carbonManagementAssessment"
                    rules={[
                      {
                        required: true,
                        message: `${t('validationReport:carbonManagementAssessment')} ${t(
                          'isRequired'
                        )}`,
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <Form.Item
                    label={`4.5 ${t('validationReport:changesOfTheProjectActivity')}`}
                    name="changesOfTheProjectActivity"
                    rules={[
                      {
                        required: true,
                        message: `${t('validationReport:changesOfTheProjectActivity')} ${t(
                          'isRequired'
                        )}`,
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <Form.Item
                    label={`4.6 ${t('validationReport:environmentImpact')}`}
                    name="environmentImpact"
                    rules={[
                      {
                        required: true,
                        message: `${t('validationReport:environmentImpact')} ${t('isRequired')}`,
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <Form.Item
                    label={`4.6 ${t('validationReport:commentsOfStakeholders')}`}
                    name="commentsOfStakeholders"
                    rules={[
                      {
                        required: true,
                        message: `${t('validationReport:commentsOfStakeholders')} ${t(
                          'isRequired'
                        )}`,
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                </Col>
              </Row>

              <Row justify={'end'} className="step-actions-end">
                <Button danger size={'large'} onClick={prev}>
                  {t('validationReport:prev')}
                </Button>
                <Button
                  type="primary"
                  size={'large'}
                  // onClick={() => {
                  //   console.log(form.getFieldsValue());
                  // }}
                  onClick={next}
                  htmlType="submit"
                >
                  {t('validationReport:next')}
                </Button>
              </Row>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

export default DataValidationProcess;
