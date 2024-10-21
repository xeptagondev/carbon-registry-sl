import { Button, Col, DatePicker, Form, Input, Row } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import TextArea from 'antd/lib/input/TextArea';
import { i18n } from 'i18next';
import React, { useEffect, useState } from 'react';
import './ProjectProposalComponent.scss';
import moment from 'moment';
import PhoneInput, {
  formatPhoneNumber,
  isPossiblePhoneNumber,
  formatPhoneNumberIntl,
  Country,
} from 'react-phone-number-input';
import validator from 'validator';
import { useConnection } from '../../Context/ConnectionContext/connectionContext';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import ProjectTimeline, { IProjectTimelineData } from './ProjectTimeline';

const ProjectProposalComponent = (props: { translator: i18n }) => {
  const { translator } = props;

  const t = translator.t;
  const [form] = useForm();

  const [countries, setCountries] = useState<[]>([]);

  const [timelineData, setTimelineData] = useState<{ x: string; y: [number, number] }[]>();

  const projectPlanEndTimeChange = (value: any) => {
    const projectPlanActivity01StartDate = form.getFieldValue('projectPlanActivity01StartDate');
    const projectPlanActivity01EndDate = form.getFieldValue('projectPlanActivity01EndDate');
    const projectPlanActivity01 = form.getFieldValue('projectPlanActivity01');

    console.log(
      '-----time Vals------',
      projectPlanActivity01StartDate,
      projectPlanActivity01EndDate,
      projectPlanActivity01
    );

    const tempTimelineData: { x: string; y: [number, number] }[] = [];

    if (projectPlanActivity01EndDate && projectPlanActivity01StartDate && projectPlanActivity01) {
      const firstObj: { x: string; y: [number, number] } = {
        x: projectPlanActivity01,
        y: [
          new Date(projectPlanActivity01StartDate).getTime(),
          new Date(projectPlanActivity01EndDate).getTime(),
        ],
      };

      tempTimelineData.push(firstObj);
    }
    const extraProjectPlanActivities = form.getFieldValue('extraProjectPlanActivities');

    if (extraProjectPlanActivities !== undefined && extraProjectPlanActivities[0] !== undefined) {
      extraProjectPlanActivities.map((activity: any) => {
        if (
          activity.projectPlanActivity &&
          activity.projectPlanActivityStartDate &&
          activity.projectPlanActivityEndDate
        ) {
          const tempObj: { x: string; y: [number, number] } = {
            x: activity.projectPlanActivity,
            y: [
              new Date(activity.projectPlanActivityStartDate).getTime(),
              new Date(activity.projectPlanActivityEndDate).getTime(),
            ],
          };
          tempTimelineData.push(tempObj);
        }
      });
    }

    if (tempTimelineData.length > 0) {
      setTimelineData(tempTimelineData);
    } else {
      setTimelineData([]);
    }
  };

  const { get, post } = useConnection();

  const [contactNoInput] = useState<any>();

  const getCountryList = async () => {
    try {
      const response = await get('national/organisation/countries');
      if (response.data) {
        const alpha2Names = response.data.map((item: any) => {
          return item.alpha2;
        });
        setCountries(alpha2Names);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCountryList();

    const formInitialValues = {
      projectCapacitySource: 'Proposed capacity',
      plantFactorSource: 'Professional Judgement',
      avgEnergyOutputSource: 'Calculated',
      gridEmissionFactorSource: 'Energy Balance-2019, SLSEA',
      emissionReductionValueSource: 'Calculated',
    };

    form.setFieldsValue(formInitialValues);
  }, []);

  const calculateTotalCost = (value?: any) => {
    const firstCost = Number(form.getFieldValue('firstCost') || 0);
    let tempTotalCost = firstCost;

    const extraCosting = form.getFieldValue('extraCosting');

    if (extraCosting !== undefined && extraCosting[0] !== undefined) {
      extraCosting.forEach((item: any) => {
        tempTotalCost += item?.cost ? Number(item?.cost) : 0;
      });
    }
    form.setFieldValue('totalCost', Number(tempTotalCost));
  };

  return (
    <div className="proposal-form-container">
      <div className="title-container">
        <div className="main">{t('projectProposal:proposalTitle')}</div>
      </div>

      <div className="forms-container">
        <Form
          labelCol={{ span: 20 }}
          wrapperCol={{ span: 24 }}
          className="proposal-form"
          layout="vertical"
          requiredMark={true}
          form={form}
        >
          {/* Introduction start */}
          <Form.Item
            className="full-width-form-item highlight-label"
            label={`1 ${t('projectProposal:introduction')}`}
            name="introduction"
            rules={[
              {
                required: true,
                message: `${t('projectProposal:introduction')} ${t('isRequired')}`,
              },
            ]}
          >
            <TextArea rows={4} placeholder={'Give a brief introduction about the project.'} />
          </Form.Item>

          <Row className="row" gutter={[40, 16]}>
            <Col xl={12} md={24}>
              <div className="step-form-right-col">
                <Form.Item
                  label={t('projectProposal:projectTitle')}
                  name="projectTitle"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:projectTitle')} ${t('isRequired')}`,
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>

                <Form.Item
                  label={t('projectProposal:proposalNo')}
                  name="proposalNo"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:proposalNo')} ${t('isRequired')}`,
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>

                <Form.Item
                  label={t('projectProposal:dateOfIssue')}
                  name="dateOfIssue"
                  rules={[
                    {
                      required: true,
                      message: '',
                    },
                    {
                      validator: async (rule, value) => {
                        if (
                          String(value).trim() === '' ||
                          String(value).trim() === undefined ||
                          value === null ||
                          value === undefined
                        ) {
                          throw new Error(`${t('projectProposal:dateOfIssue')} ${t('isRequired')}`);
                        }
                      },
                    },
                  ]}
                >
                  <DatePicker
                    size="large"
                    disabledDate={(currentDate: any) => currentDate < moment().startOf('day')}
                  />
                </Form.Item>

                <Form.Item
                  label={t('projectProposal:revNo')}
                  name="revNo"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:revNo')} ${t('isRequired')}`,
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
            </Col>

            <Col xl={12} md={24}>
              <div className="step-form-left-col">
                <Form.Item
                  label={t('projectProposal:durationOfService')}
                  name="durationOfService"
                  className="duration-of-service"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:durationOfService')} ${t('isRequired')}`,
                    },
                  ]}
                >
                  <TextArea rows={5} />
                </Form.Item>

                <Form.Item
                  label={t('projectProposal:validityPeriod')}
                  name="validityPeriod"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:validityPeriod')} ${t('isRequired')}`,
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>

                <Form.Item
                  label={t('projectProposal:dateOfRevision')}
                  name="dateOfRevision"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:dateOfRevision')} ${t('isRequired')}`,
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
            </Col>
          </Row>
          {/* Introduction end */}

          {/* Details of project Proponent start */}
          <>
            <h4 className="section-sub-title">{t('projectProposal:detailsOfProjectProponent')}</h4>

            <Row gutter={[40, 16]}>
              <Col xl={12} md={24}>
                <Form.Item
                  label={t('projectProposal:name')}
                  name="clientName"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:name')} ${t('isRequired')}`,
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>

                <Form.Item
                  label={t('projectProposal:mobile')}
                  name="clientMobile"
                  rules={[
                    {
                      required: true,
                      // message: `${t('projectProposal:mobile')} ${t('isRequired')}`,
                      message: ``,
                    },
                    {
                      validator: async (rule: any, value: any) => {
                        if (
                          String(value).trim() === '' ||
                          String(value).trim() === undefined ||
                          value === null ||
                          value === undefined
                        ) {
                          throw new Error(`${t('projectProposal:mobile')} ${t('isRequired')}`);
                        } else {
                          const phoneNo = formatPhoneNumber(String(value));
                          if (String(value).trim() !== '') {
                            if (phoneNo === null || phoneNo === '' || phoneNo === undefined) {
                              throw new Error(`${t('projectProposal:mobile')} ${t('isRequired')}`);
                            } else {
                              if (!isPossiblePhoneNumber(String(value))) {
                                throw new Error(`${t('projectProposal:mobile')} ${t('isInvalid')}`);
                              }
                            }
                          }
                        }
                      },
                    },
                  ]}
                >
                  <PhoneInput
                    // placeholder={t('projectProposal:phoneNo')}
                    international
                    value={formatPhoneNumberIntl(contactNoInput)}
                    defaultCountry="LK"
                    countryCallingCodeEditable={false}
                    onChange={(v) => {}}
                    countries={countries as Country[]}
                  />
                </Form.Item>
              </Col>
              <Col xl={12} md={24}>
                <Form.Item
                  label={t('projectProposal:contactPerson')}
                  name="clientContactPerson"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:contactPerson')} ${t('isRequired')}`,
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
                <Form.Item
                  label={t('projectProposal:email')}
                  name="clientEmail"
                  rules={[
                    {
                      required: true,
                      // message: `${t('projectProposal:email')} ${t('isRequired')}`,
                    },
                    {
                      validator: async (rule, value) => {
                        if (
                          String(value).trim() === '' ||
                          String(value).trim() === undefined ||
                          value === null ||
                          value === undefined
                        ) {
                          throw new Error(`${t('projectProposal:email')} ${t('isRequired')}`);
                        } else {
                          const val = value.trim();
                          const reg =
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                          const matches = val.match(reg) ? val.match(reg) : [];
                          if (matches.length === 0) {
                            throw new Error(`${t('projectProposal:email')} ${t('isInvalid')}`);
                          }
                        }
                      },
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
          </>
          {/* Details of project Proponent end */}

          {/* Details of Service Provider start */}
          <>
            <h4 className="section-sub-title">{t('projectProposal:detailsOfServiceProvider')}</h4>

            <Row gutter={[40, 16]}>
              <Col xl={12} md={24}>
                <Form.Item
                  label={t('projectProposal:name')}
                  name="serviceProviderName"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:name')} ${t('isRequired')}`,
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>

                <Form.Item
                  label={t('projectProposal:mobile')}
                  name="serviceProviderMobile"
                  rules={[
                    {
                      required: true,
                      // message: `${t('projectProposal:mobile')} ${t('isRequired')}`,
                      message: ``,
                    },
                    {
                      validator: async (rule: any, value: any) => {
                        if (
                          String(value).trim() === '' ||
                          String(value).trim() === undefined ||
                          value === null ||
                          value === undefined
                        ) {
                          throw new Error(`${t('projectProposal:mobile')} ${t('isRequired')}`);
                        } else {
                          const phoneNo = formatPhoneNumber(String(value));
                          if (String(value).trim() !== '') {
                            if (phoneNo === null || phoneNo === '' || phoneNo === undefined) {
                              throw new Error(`${t('projectProposal:mobile')} ${t('isRequired')}`);
                            } else {
                              if (!isPossiblePhoneNumber(String(value))) {
                                throw new Error(`${t('projectProposal:mobile')} ${t('isInvalid')}`);
                              }
                            }
                          }
                        }
                      },
                    },
                  ]}
                >
                  <PhoneInput
                    international
                    value={formatPhoneNumberIntl(contactNoInput)}
                    defaultCountry="LK"
                    countryCallingCodeEditable={false}
                    onChange={(v) => {}}
                    countries={countries as Country[]}
                  />
                </Form.Item>
                <Form.Item
                  label={t('projectProposal:email')}
                  name="email"
                  rules={[
                    {
                      required: true,
                      // message: `${t('projectProposal:email')} ${t('isRequired')}`,
                    },
                    {
                      validator: async (rule, value) => {
                        if (
                          String(value).trim() === '' ||
                          String(value).trim() === undefined ||
                          value === null ||
                          value === undefined
                        ) {
                          throw new Error(`${t('projectProposal:email')} ${t('isRequired')}`);
                        } else {
                          const val = value.trim();
                          const reg =
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                          const matches = val.match(reg) ? val.match(reg) : [];
                          if (matches.length === 0) {
                            throw new Error(`${t('projectProposal:email')} ${t('isInvalid')}`);
                          }
                        }
                      },
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col xl={12} md={24}>
                <Form.Item
                  label={t('projectProposal:contactPerson')}
                  name="serviceProviderContactPerson"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:contactPerson')} ${t('isRequired')}`,
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>

                <Form.Item
                  label={t('projectProposal:mobile')}
                  name="serviceProviderMobile"
                  rules={[
                    {
                      required: true,
                      // message: `${t('projectProposal:mobile')} ${t('isRequired')}`,
                      message: ``,
                    },
                    {
                      validator: async (rule: any, value: any) => {
                        if (
                          String(value).trim() === '' ||
                          String(value).trim() === undefined ||
                          value === null ||
                          value === undefined
                        ) {
                          throw new Error(`${t('projectProposal:mobile')} ${t('isRequired')}`);
                        } else {
                          const phoneNo = formatPhoneNumber(String(value));
                          if (String(value).trim() !== '') {
                            if (phoneNo === null || phoneNo === '' || phoneNo === undefined) {
                              throw new Error(`${t('projectProposal:mobile')} ${t('isRequired')}`);
                            } else {
                              if (!isPossiblePhoneNumber(String(value))) {
                                throw new Error(`${t('projectProposal:mobile')} ${t('isInvalid')}`);
                              }
                            }
                          }
                        }
                      },
                    },
                  ]}
                >
                  <PhoneInput
                    international
                    value={formatPhoneNumberIntl(contactNoInput)}
                    defaultCountry="LK"
                    countryCallingCodeEditable={false}
                    onChange={(v) => {}}
                    countries={countries as Country[]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
          {/* Details of Service Provider end */}

          {/* Overall background start */}
          <>
            <h4 className="section-title mg-top-2">
              2 {t('projectProposal:overallProjectBackground')}
            </h4>
            <Form.Item
              label={t('projectProposal:overallProjectBackground')}
              name="overallProjectBackground"
              rules={[
                {
                  required: true,
                  message: `${t('projectProposal:overallProjectBackground')} ${t('isRequired')}`,
                },
              ]}
            >
              <TextArea rows={4} placeholder="Explain the Overall Project Background" />
            </Form.Item>
          </>
          {/* Overall background end */}

          {/* Sri Lanka Carbon Crediting Scheme(SLCCS) start */}
          <>
            <h4 className="section-title mg-top-2">3 {t('projectProposal:creditingScheme')}</h4>

            <p className="section-description">
              Sri Lanka Carbon Crediting Scheme (SLCCS) is a Greenhouse Gas (GHG) reduction
              programme which needs encouragement of every kind of active carbon reduction or
              removal projects for the benefits of the Environment, Society and the Economy. It
              brings quality assurance for such projects and carbon offsets. It is a voluntary
              initiative that regulates and registers such projects which offsets the GHG emissions
              from companies, project developers, or other entities within a context of quality,
              credibility and transparency.
            </p>

            <h4 className="section-sub-title">{t('projectProposal:slccsObjectives')}</h4>
            <ol className="objectives-list section-description">
              <li>
                To introduce more effective and user friendly programme that brings quality
                assurance to authentic GHG reduction and removal project activities.
              </li>
              <li>
                To provide transparent service to its clients in the process of project Validation,
                Verification, Certification and Registration.
              </li>
              <li>
                To facilitate responsible GHG emitters for voluntary offsets of quality assured
                emission reductions generated by their own GHG reduction projects.
              </li>
              <li>
                To encourage the projects benefited on aspects other than GHG reduction and/or
                removal such as helping communities to improve their livelihood, enhancing
                ecological services.
              </li>
              <li>
                To innovate paths in carbon crediting to businesses, non-profits and government
                entities that engage in on the ground climate action.
              </li>
            </ol>
          </>
          {/* Sri Lanka Carbon Crediting Scheme(SLCCS) end */}

          {/* Scope for this proposal start */}
          <>
            <Form.Item
              className="full-width-form-item highlight-label mg-top-2"
              label={`4 ${t('projectProposal:scopeForThisProposal')}`}
              name="scopeForThisProposal"
              rules={[
                {
                  required: true,
                  message: `${t('projectProposal:scopeForThisProposal')} ${t('isRequired')}`,
                },
              ]}
            >
              <TextArea rows={4} placeholder={'Give a brief introduction about the project.'} />
            </Form.Item>
          </>
          {/* Scope for this proposal end */}

          {/* Scope table start */}
          <div className="scope-table">
            <Row className="header">
              <Col md={12} xl={12} className="col-1">
                Activity
              </Col>
              <Col md={12} xl={12} className="col-2">
                Responsible
              </Col>
            </Row>
            <Row className="data-row">
              <Col md={12} xl={12} className="col-1 data-col">
                {t('projectProposal:developProjectConcept')}
              </Col>
              <Col md={12} xl={12} className="col-2 data-col">
                <Form.Item
                  name="developProjectConcept"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:required')}`,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row className="data-row">
              <Col md={12} xl={12} className="col-1 data-col">
                {t('projectProposal:notificationSLCSS')}
              </Col>
              <Col md={12} xl={12} className="col-2 data-col">
                <Form.Item
                  name="notificationSLCSS"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:required')}`,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row className="data-row">
              <Col md={12} xl={12} className="col-1 data-col">
                {t('projectProposal:prepareCMA')}
              </Col>
              <Col md={12} xl={12} className="col-2 data-col">
                <Form.Item
                  name="prepareCMA"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:required')}`,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row className="data-row">
              <Col md={12} xl={12} className="col-1 data-col">
                {t('projectProposal:validationCMA')}
              </Col>
              <Col md={12} xl={12} className="col-2 data-col">
                <Form.Item
                  name="validationCMA"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:required')}`,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row className="data-row">
              <Col md={12} xl={12} className="col-1 data-col">
                {t('projectProposal:cmaWebHosting')}
              </Col>
              <Col md={12} xl={12} className="col-2 data-col">
                {t('projectProposal:slccsAdministrator')}
              </Col>
            </Row>

            <Row className="data-row">
              <Col md={12} xl={12} className="col-1 data-col">
                {t('projectProposal:validationSiteVisit')}
              </Col>
              <Col md={12} xl={12} className="col-2 data-col">
                {t('projectProposal:validationTeam')}
              </Col>
            </Row>

            <Row className="data-row">
              <Col md={12} xl={12} className="col-1 data-col">
                {t('projectProposal:resolutionCarsAndCLs')}
              </Col>
              <Col md={12} xl={12} className="col-2 data-col">
                {t('projectProposal:validationTeam')}
              </Col>
            </Row>

            <Row className="data-row">
              <Col md={12} xl={12} className="col-1 data-col">
                {t('projectProposal:submissionFinalValidation')}
              </Col>
              <Col md={12} xl={12} className="col-2 data-col">
                {t('projectProposal:validationTeam')}
              </Col>
            </Row>

            <Row className="data-row">
              <Col md={12} xl={12} className="col-1 data-col">
                {t('projectProposal:issuesRaisedByEB')}
              </Col>
              <Col md={12} xl={12} className="col-2 data-col">
                {t('projectProposal:validationTeam')}
              </Col>
            </Row>

            <Row className="data-row">
              <Col md={12} xl={12} className="col-1 data-col">
                {t('projectProposal:issuesRaisedByEB')}
              </Col>
              <Col md={12} xl={12} className="col-2 data-col">
                {t('projectProposal:validationTeam')}
              </Col>
            </Row>

            <Row className="data-row">
              <Col md={12} xl={12} className="col-1 data-col">
                {t('projectProposal:preparationOfMonitoringReport')}
              </Col>
              <Col md={12} xl={12} className="col-2 data-col">
                <Form.Item
                  name="preparationOfMonitoringReport"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:required')}`,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row className="data-row">
              <Col md={12} xl={12} className="col-1 data-col">
                {t('projectProposal:submissionOfMonitoringReport')}
              </Col>
              <Col md={12} xl={12} className="col-2 data-col">
                <Form.Item
                  name="submissionOfMonitoringReport"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:required')}`,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row className="data-row">
              <Col md={12} xl={12} className="col-1 data-col">
                {t('projectProposal:draftVerficationReport')}
              </Col>
              <Col md={12} xl={12} className="col-2 data-col">
                {t('projectProposal:verificationTeam')}
              </Col>
            </Row>

            <Row className="data-row">
              <Col md={12} xl={12} className="col-1 data-col">
                {t('projectProposal:resolutionOfCARSandCLs')}
              </Col>
              <Col md={12} xl={12} className="col-2 data-col">
                {t('projectProposal:verificationTeam')}
              </Col>
            </Row>

            <Row className="data-row">
              <Col md={12} xl={12} className="col-1 data-col">
                {t('projectProposal:submissionFinalReportsToEB')}
              </Col>
              <Col md={12} xl={12} className="col-2 data-col">
                {t('projectProposal:verificationTeam')}
              </Col>
            </Row>

            <Row className="data-row">
              <Col md={12} xl={12} className="col-1 data-col">
                {t('projectProposal:respondingToIssues')}
              </Col>
              <Col md={12} xl={12} className="col-2 data-col">
                {t('projectProposal:verificationTeam')}
              </Col>
            </Row>

            <Row className="data-row">
              <Col md={12} xl={12} className="col-1 data-col">
                {t('projectProposal:issuance')}
              </Col>
              <Col md={12} xl={12} className="col-2 data-col">
                {t('projectProposal:slccsAdministrator')}
              </Col>
            </Row>
          </div>
          {/* Scope table end */}

          <>
            <h4 className="section-description-title" style={{ marginTop: '8px' }}>
              {t('projectProposal:cma')}
            </h4>
            <p className="section-description mg-bottom-1">
              CMA is the document containing description of the project to be submitted for the
              validation and registration. This document can be prepared by Project Proponent (PP)
              or other third-party on behalf of the PP according to the format given by SLCCS.
            </p>
          </>

          <>
            <h4 className="section-description-title">{t('projectProposal:validationoftheCMA')}</h4>
            <p className="section-description mg-bottom-1">
              Validation process would be done by Validation/Verification Team of Sri Lanka Climate
              Fund based on the CMA provided by PP or 3rd Party by reviewing required document on
              site and off site.
            </p>
          </>

          <>
            <h4 className="section-description-title">
              {t('projectProposal:projectRegistration')}
            </h4>
            <p className="section-description mg-bottom-1">
              Project registration would be done by SLCCS registry division of Sri Lanka Climate
              Fund based on the Validation Report provided by Validation Division of Sri Lanka
              Climate Fund.
            </p>
          </>

          <>
            <h4 className="section-description-title">{t('projectProposal:monitoringReport')}</h4>
            <p className="section-description mg-bottom-1">
              Monitoring report is the document containing quantification of the emission reduction
              within the selected monitoring period to be submitted for verification. This document
              can be prepared by Project Proponent (PP) or other third-party on behalf of the PP
              according to the format given by SLCCS.
            </p>
          </>

          <>
            <h4 className="section-description-title">{t('projectProposal:verificationOfMR')}</h4>
            <p className="section-description mg-bottom-1">
              Verification process would be done by Verification Team of Sri Lanka Climate Fund
              based on the MR provided by PP or 3rd Party by reviewing required document on site and
              off site.
            </p>
          </>

          <>
            <h4 className="section-description-title">{t('projectProposal:issuanceOfSCER')}</h4>
            <p className="section-description mg-bottom-1">
              The amount of Sri Lankan Certified Emission Reduction (SCER) would be certified by
              SLCCS registry division and that amount would credited to PP.
            </p>
          </>

          {/* Estimation of GHG Reduction start */}
          <>
            <h4 className="section-title mg-bottom-1">
              {t('projectProposal:estimationOfGHGReduction')}
            </h4>
            <p className="section-description">
              Emission reduction resulting from the implementation of this project is as follows
            </p>

            <p className="equation">
              <i>
                BE<sub>y</sub> = EG<sub>y</sub> * EF<sub>y</sub>
              </i>

              <span>
                <i>Equation (1)</i>
              </span>
            </p>

            <div className="equation-description">
              <p className="mg-top-1 mg-bottom-1">where</p>

              <i>
                BE<sub>y</sub> = Baseline Emissions in year y (tCO<sub>2</sub>)
              </i>
              <br />

              <i>
                EG<sub>y</sub> = Quantity of net electricity displaced as a result of the
                implementation of the project activity in year y (MWh)
              </i>
              <br />

              <i>
                EF<sub>y</sub> = CO<sub>2</sub> Emission factor of the grid in year y (tCO
                <sub>2</sub>/ MWh)
              </i>
              <br />
            </div>

            {/* Reduction table start */}
            <div className="reductions-table mg-top-1">
              <Row justify={'space-between'} gutter={40} className="header">
                <Col md={6} xl={6}>
                  Parameter
                </Col>
                <Col md={3} xl={3}>
                  Value
                </Col>
                <Col md={3} xl={3}>
                  Unit
                </Col>
                <Col md={8} xl={8}>
                  Source
                </Col>
              </Row>

              <Row justify={'space-between'} align={'middle'} gutter={40} className="data-row">
                <Col md={6} xl={6}>
                  Project Capacity
                </Col>
                <Col md={3} xl={3}>
                  <Form.Item
                    name="projectCapacityValue"
                    rules={[
                      {
                        required: true,
                        message: `${t('projectProposal:required')}`,
                      },
                      {
                        validator(rule, value) {
                          if (!value) {
                            return Promise.resolve();
                          }

                          // eslint-disable-next-line no-restricted-globals
                          if (isNaN(value)) {
                            return Promise.reject(new Error('Should be an integer!'));
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={3} xl={3}>
                  <Form.Item
                    name="projectCapacityUnit"
                    rules={[
                      {
                        required: true,
                        message: `${t('projectProposal:required')}`,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={8} xl={8}>
                  <Form.Item
                    name="projectCapacitySource"
                    rules={[
                      {
                        required: true,
                        message: `${t('projectProposal:required')}`,
                      },
                    ]}
                  >
                    <Input size={'large'} disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Row justify={'space-between'} align={'middle'} gutter={40} className="data-row">
                <Col md={6} xl={6}>
                  Plant Factor
                </Col>
                <Col md={3} xl={3}>
                  <Form.Item
                    name="plantFactorValue"
                    rules={[
                      {
                        required: true,
                        message: `${t('projectProposal:required')}`,
                      },
                      {
                        validator(rule, value) {
                          if (!value) {
                            return Promise.resolve();
                          }

                          // eslint-disable-next-line no-restricted-globals
                          if (isNaN(value)) {
                            return Promise.reject(new Error('Should be an integer!'));
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={3} xl={3}>
                  <Form.Item
                    name="plantFactorUnit"
                    rules={[
                      {
                        required: true,
                        message: `${t('projectProposal:required')}`,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={8} xl={8}>
                  <Form.Item
                    name="plantFactorSource"
                    rules={[
                      {
                        required: true,
                        message: `${t('projectProposal:required')}`,
                      },
                    ]}
                  >
                    <Input size={'large'} disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Row justify={'space-between'} align={'middle'} gutter={40} className="data-row">
                <Col md={6} xl={6}>
                  Average Energy Output
                </Col>
                <Col md={3} xl={3}>
                  <Form.Item
                    name="avgEnergyOutputValue"
                    rules={[
                      {
                        required: true,
                        message: `${t('projectProposal:required')}`,
                      },
                      {
                        validator(rule, value) {
                          if (!value) {
                            return Promise.resolve();
                          }

                          // eslint-disable-next-line no-restricted-globals
                          if (isNaN(value)) {
                            return Promise.reject(new Error('Should be an integer!'));
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={3} xl={3}>
                  <Form.Item
                    name="avgEnergyOutputUnit"
                    rules={[
                      {
                        required: true,
                        message: `${t('projectProposal:required')}`,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={8} xl={8}>
                  <Form.Item
                    name="avgEnergyOutputSource"
                    rules={[
                      {
                        required: true,
                        message: `${t('projectProposal:required')}`,
                      },
                    ]}
                  >
                    <Input size={'large'} disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Row justify={'space-between'} align={'middle'} gutter={40} className="data-row">
                <Col md={6} xl={6}>
                  Grid Emission Factor (EFCM,Grid,y)
                </Col>
                <Col md={3} xl={3}>
                  <Form.Item
                    name="gridEmissionFactorValue"
                    rules={[
                      {
                        required: true,
                        message: `${t('projectProposal:required')}`,
                      },
                      {
                        validator(rule, value) {
                          if (!value) {
                            return Promise.resolve();
                          }

                          // eslint-disable-next-line no-restricted-globals
                          if (isNaN(value)) {
                            return Promise.reject(new Error('Should be an integer'));
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={3} xl={3}>
                  <Form.Item
                    name="gridEmissionFactorUnit"
                    rules={[
                      {
                        required: true,
                        message: `${t('projectProposal:required')}`,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={8} xl={8}>
                  <Form.Item
                    name="gridEmissionFactorSource"
                    rules={[
                      {
                        required: true,
                        message: `${t('projectProposal:required')}`,
                      },
                    ]}
                  >
                    <Input size={'large'} disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Row justify={'space-between'} align={'middle'} gutter={40} className="data-row">
                <Col md={6} xl={6}>
                  Emission Reduction (ERy)
                </Col>
                <Col md={3} xl={3}>
                  <Form.Item
                    name="emissionReductionValue"
                    rules={[
                      {
                        required: true,
                        message: `${t('projectProposal:required')}`,
                      },
                      {
                        validator(rule, value) {
                          if (!value) {
                            return Promise.resolve();
                          }

                          // eslint-disable-next-line no-restricted-globals
                          if (isNaN(value)) {
                            return Promise.reject(new Error('Should be an integer'));
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={3} xl={3}>
                  <Form.Item
                    name="emissionReductionValueUnit"
                    rules={[
                      {
                        required: true,
                        message: `${t('projectProposal:required')}`,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={8} xl={8}>
                  <Form.Item
                    name="emissionReductionValueSource"
                    rules={[
                      {
                        required: true,
                        message: `${t('projectProposal:required')}`,
                      },
                    ]}
                  >
                    <Input size={'large'} disabled />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            {/* Reduction table end */}

            <Row align={'middle'} gutter={16} className="avg-credit-gen-row mg-top-1">
              <Col>
                <p>Average Credit Generation per annum:</p>
              </Col>
              <Col>
                <Form.Item
                  name="avgCreditGenerationPerAnnum"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:required')}`,
                    },
                    {
                      validator(rule, value) {
                        if (!value) {
                          return Promise.resolve();
                        }

                        // eslint-disable-next-line no-restricted-globals
                        if (isNaN(value)) {
                          return Promise.reject(new Error('Should be an integer'));
                        }

                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input placeholder="5412 tCO2e" />
                </Form.Item>
              </Col>
            </Row>

            <p className="text-color">
              Note that in the calculation of net emission reduction, in addition to baseline
              emission, project and leakage emissions are required to be considered. In this
              estimation, it is assumed assumed that no project and leakage emissions has occurred
              in the project activity
            </p>
          </>
          {/* Estimation of GHG Reduction end */}

          {/* Project Time Plan start */}
          <>
            <h4 className="section-title">6. {t('projectProposal:projectTimePlan')}</h4>
            <div className="project-timeline-table">
              <Row className="header" justify={'space-between'}>
                <Col md={3} xl={3} className="col-1">
                  NO.
                </Col>
                <Col md={9} xl={9} className="col-2">
                  Activity
                </Col>
                <Col md={8} xl={8} className="col-3">
                  Start Date and End Date
                </Col>
                <Col md={2} xl={2}>
                  {' '}
                </Col>
              </Row>

              <Row justify={'space-between'}>
                <Col md={3} xl={3} className="col-1">
                  01
                </Col>
                <Col md={9} xl={9} className="col-2">
                  <Form.Item
                    name="projectPlanActivity01"
                    rules={[
                      {
                        required: true,
                        message: `${t('projectProposal:required')}`,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={8} xl={8} className="col-3">
                  <Form.Item
                    label={``}
                    name="projectPlanActivity01StartDate"
                    className="datepicker"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                      {
                        validator: async (rule, value) => {
                          if (
                            String(value).trim() === '' ||
                            String(value).trim() === undefined ||
                            value === null ||
                            value === undefined
                          ) {
                            throw new Error(`${t('CMAForm:required')}`);
                          }
                        },
                      },
                    ]}
                  >
                    <DatePicker size="large" placeholder="Start Date" picker="date" />
                  </Form.Item>
                  <p>to</p>
                  <Form.Item
                    label={``}
                    name="projectPlanActivity01EndDate"
                    className="datepicker"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                      {
                        validator: async (rule, value) => {
                          if (
                            String(value).trim() === '' ||
                            String(value).trim() === undefined ||
                            value === null ||
                            value === undefined
                          ) {
                            throw new Error(`${t('CMAForm:required')}`);
                          }
                        },
                      },
                    ]}
                  >
                    <DatePicker
                      size="large"
                      placeholder="End Date"
                      picker="date"
                      onChange={(value) => projectPlanEndTimeChange(value)}
                      disabledDate={(currentDate: any) =>
                        currentDate <
                        moment(form.getFieldValue('projectPlanActivity01')).startOf('month')
                      }
                    />
                  </Form.Item>
                </Col>
                <Col md={2} xl={2}>
                  {' '}
                </Col>
              </Row>

              <Form.List name="extraProjectPlanActivities">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <>
                        <Row justify={'space-between'}>
                          <Col md={3} xl={3} className="col-1">
                            {name > 7 ? name + 2 : '0' + String(name + 2)}
                          </Col>
                          <Col md={9} xl={9} className="col-2">
                            <Form.Item
                              name={[name, 'projectPlanActivity']}
                              rules={[
                                {
                                  required: true,
                                  message: `${t('projectProposal:required')}`,
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col md={8} xl={8} className="col-3">
                            <Form.Item
                              label={``}
                              name={[name, 'projectPlanActivityStartDate']}
                              className="datepicker"
                              rules={[
                                {
                                  required: true,
                                  message: '',
                                },
                                {
                                  validator: async (rule, value) => {
                                    if (
                                      String(value).trim() === '' ||
                                      String(value).trim() === undefined ||
                                      value === null ||
                                      value === undefined
                                    ) {
                                      throw new Error(`${t('CMAForm:required')}`);
                                    }
                                  },
                                },
                              ]}
                            >
                              <DatePicker
                                size="large"
                                placeholder="Start Date"
                                picker="date"
                                // disabledDate={(currentDate: any) => currentDate < moment().startOf('day')}
                              />
                            </Form.Item>
                            <p>to</p>
                            <Form.Item
                              label={``}
                              name={[name, 'projectPlanActivityEndDate']}
                              className="datepicker"
                              rules={[
                                {
                                  required: true,
                                  message: '',
                                },
                                {
                                  validator: async (rule, value) => {
                                    if (
                                      String(value).trim() === '' ||
                                      String(value).trim() === undefined ||
                                      value === null ||
                                      value === undefined
                                    ) {
                                      throw new Error(`${t('CMAForm:required')}`);
                                    }
                                  },
                                },
                              ]}
                            >
                              <DatePicker
                                size="large"
                                placeholder="End Date"
                                picker="date"
                                onChange={(value) => projectPlanEndTimeChange(value)}
                                disabledDate={(currentDate: any) =>
                                  currentDate <
                                  moment(
                                    form.getFieldValue('extraProjectPlanActivities')[name]
                                      .projectPlanActivityStartDate
                                  ).startOf('day')
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col md={2} xl={2} className="col-4">
                            <Form.Item>
                              <Button
                                onClick={() => {
                                  remove(name);
                                }}
                                icon={<MinusOutlined />}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    ))}

                    <Form.Item>
                      <Button
                        onClick={() => {
                          add();
                        }}
                        icon={<PlusOutlined />}
                      />
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
            {timelineData && timelineData.length > 0 && <ProjectTimeline data={timelineData} />}
          </>
          {/* Project Time Plan end */}

          <Form.Item
            className="full-width-form-item highlight-label"
            label={`7. ${t('projectProposal:scopeOfWork')}`}
            name="scopeOfWork"
            rules={[
              {
                required: true,
                message: `${t('projectProposal:scopeOfWork')} ${t('isRequired')}`,
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            className="full-width-form-item highlight-label"
            label={`8 ${t('projectProposal:teamComposition')}`}
            name="teamComposition"
            rules={[
              {
                required: true,
                message: `${t('projectProposal:teamComposition')} ${t('isRequired')}`,
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>

          {/* Team members table start */}
          <>
            <h4 className="section-title">Team members are given below:</h4>
            <div className="team-members-table">
              <Row className="header">
                <Col md={11} xl={11} className="col-1">
                  Consultant
                </Col>
                <Col md={11} xl={11} className="col-2">
                  Role
                </Col>
                <Col md={2} xl={2}>
                  {' '}
                </Col>
              </Row>

              <Row>
                <Col md={11} xl={11} className="col-1">
                  <Form.Item
                    name="firstMemberConsultant"
                    rules={[
                      {
                        required: true,
                        message: `${t('projectProposal:required')}`,
                      },
                    ]}
                  >
                    <Input placeholder="Name" />
                  </Form.Item>
                </Col>
                <Col md={11} xl={11} className="col-2">
                  <Form.Item
                    name="firstMemberRole"
                    rules={[
                      {
                        required: true,
                        message: `${t('projectProposal:required')}`,
                      },
                    ]}
                  >
                    <Input placeholder="Role" />
                  </Form.Item>
                </Col>
                <Col md={2} xl={2}>
                  {' '}
                </Col>
              </Row>

              <Form.List name="extraMembers">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <>
                        <Row align={'middle'}>
                          <Col md={11} xl={11} className="col-1">
                            <Form.Item
                              name={[name, 'memberConsultant']}
                              rules={[
                                {
                                  required: true,
                                  message: `${t('projectProposal:required')}`,
                                },
                              ]}
                            >
                              <Input placeholder="Name" />
                            </Form.Item>
                          </Col>
                          <Col md={11} xl={11} className="col-2">
                            <Form.Item
                              name={[name, 'memberRole']}
                              rules={[
                                {
                                  required: true,
                                  message: `${t('projectProposal:required')}`,
                                },
                              ]}
                            >
                              <Input placeholder="Role" />
                            </Form.Item>
                          </Col>
                          <Col md={2} xl={2}>
                            <Form.Item>
                              <Button
                                className="minusBtn"
                                onClick={() => {
                                  remove(name);
                                }}
                                icon={<MinusOutlined />}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    ))}

                    <Form.Item>
                      <Button
                        className="addBtn"
                        onClick={() => {
                          add();
                        }}
                        icon={<PlusOutlined />}
                      />
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
          </>
          {/* Team members table end */}
          <Form.Item
            className="full-width-form-item highlight-label"
            label={`8. ${t('projectProposal:costing')}`}
            name="costing"
            rules={[
              {
                required: true,
                message: `${t('projectProposal:costing')} ${t('isRequired')}`,
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>

          {/* Costing table start */}
          <div className="costing-table">
            <Row className="header">
              <Col md={4} xl={4}>
                No
              </Col>
              <Col md={8} xl={8}>
                Service Category
              </Col>
              <Col md={6} xl={6}>
                Cost (LKR)
              </Col>
              <Col md={4} xl={4}>
                {' '}
              </Col>
            </Row>
            <Row className="data-rows">
              <Col md={4} xl={4} className="col-1">
                1
              </Col>
              <Col md={8} xl={8} className="col-2">
                <Form.Item
                  name="firstServiceCategory"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:isRequired')}`,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col md={6} xl={6} className="col-3">
                <Form.Item
                  name="firstCost"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:isRequired')}`,
                    },
                    {
                      validator(rule, value) {
                        if (!value) {
                          return Promise.resolve();
                        }

                        // eslint-disable-next-line no-restricted-globals
                        if (isNaN(value)) {
                          return Promise.reject(new Error('Should be an integer!'));
                        }

                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input onChange={(value) => calculateTotalCost(value)} />
                </Form.Item>
              </Col>
              <Col md={4} xl={4} className="col-4">
                {' '}
              </Col>
            </Row>
            <Form.List name="extraCosting">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row className="data-rows">
                      <Col md={4} xl={4} className="col-1">
                        1
                      </Col>
                      <Col md={8} xl={8} className="col-2">
                        <Form.Item
                          name={[name, 'ServiceCategory']}
                          rules={[
                            {
                              required: true,
                              message: `${t('projectProposal:isRequired')}`,
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col md={6} xl={6} className="col-3">
                        <Form.Item
                          name={[name, 'cost']}
                          rules={[
                            {
                              required: true,
                              message: `${t('projectProposal:isRequired')}`,
                            },
                            {
                              validator(rule, value) {
                                if (!value) {
                                  return Promise.resolve();
                                }

                                // eslint-disable-next-line no-restricted-globals
                                if (isNaN(value)) {
                                  return Promise.reject(new Error('Should be an integer!'));
                                }

                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <Input onChange={(value) => calculateTotalCost(value)} />
                        </Form.Item>
                      </Col>
                      <Col md={4} xl={4} className="col-4">
                        <Form.Item>
                          <Button
                            onClick={() => {
                              remove(name);
                              calculateTotalCost();
                            }}
                            icon={<MinusOutlined />}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button
                      onClick={() => {
                        add();
                      }}
                      icon={<PlusOutlined />}
                    />
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Row className="total-cost-row">
              <Col md={4} xl={4} className="col-1">
                {' '}
              </Col>
              <Col md={8} xl={8} className="col-2">
                Total
              </Col>
              <Col md={6} xl={6} className="col-3 ">
                <Form.Item
                  name="totalCost"
                  rules={[
                    {
                      required: true,
                      message: `${t('projectProposal:isRequired')}`,
                    },
                    {
                      validator(rule, value) {
                        if (!value) {
                          return Promise.resolve();
                        }

                        // eslint-disable-next-line no-restricted-globals
                        if (isNaN(value)) {
                          return Promise.reject(new Error('Should be an integer!'));
                        }

                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col md={4} xl={4} className="col-4">
                {' '}
              </Col>
            </Row>
            <h4 className="description-title">Conditions:</h4>
            <div className="description">
              <ul>
                <li>50% of the payment on up front</li>
                <li>50% of the payment on completing the Validation and Verification </li>
              </ul>
            </div>
          </div>

          {/* Costing table end */}

          {/* Executive Board Members start */}
          <>
            <h4 className="section-title">10. Executive Board of SLCCS(SLCCS EB)</h4>
            <p>
              SLCF will validate/verify the project independently, and ensure the avoidance of the
              double counting by the establishment of SLCCS Executive Board and responsible for
              monitoring and regularly evaluating the process and performance, seeking to ensure the
              continuity of SLCCS functions
            </p>

            <p>SLCCS Executive Board Members</p>

            <div className="executive-board-members-table">
              <Row>
                <Col md={20} xl={10}>
                  <Form.Item
                    name="firstExecutiveBoardMember"
                    rules={[
                      {
                        required: true,
                        message: `${t('projectProposal:isRequired')}`,
                      },
                    ]}
                  >
                    <Input placeholder="Name" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.List name="extraExecutiveBoardMembers">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restFilled }) => (
                      <Row>
                        <Col md={20} xl={10}>
                          <Form.Item
                            name="firstExecutiveBoardMember"
                            rules={[
                              {
                                required: true,
                                message: `${t('projectProposal:isRequired')}`,
                              },
                            ]}
                          >
                            <Input placeholder="Name" />
                          </Form.Item>
                        </Col>
                        <Col md={2} xl={2}>
                          <Form.Item>
                            <Button
                              style={{ marginLeft: '8px' }}
                              onClick={() => {
                                remove(name);
                              }}
                              icon={<MinusOutlined />}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    ))}

                    <Form.Item>
                      <Button
                        onClick={() => {
                          add();
                        }}
                        icon={<PlusOutlined />}
                      />
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
          </>
          {/* Executive Board Members End */}

          {/*  Introduction to climate fund start */}
          <>
            <h4 className="section-title">11. Introduction to Sri Lanka Climate Fund</h4>
            <p>
              SLCF is a public-private partnership company established under the companies’ Act No.7
              of 2007, under the Ministry of Environment and Renewable Energy to promote carbon
              trading projects in Sri Lanka. Company provides technical and finance resources to
              develop projects contribute to the sustainability of the environment in any sector.
              SLCF also purchases carbon credits from project owners while providing any service
              relating to CDM project development.{' '}
            </p>

            <div className="mg-top-1">Our vision </div>
            <div>Carbon neutral and climate-resilient blue-green economy in Sri Lanka.</div>

            <div className="mg-top-1">Mission</div>
            <div className="mg-bottom-1">
              To support the nation to achieve a low carbon and climate-resilient blue green
              development
            </div>
          </>
          {/*  Introduction to climate fund End */}

          <></>

          <Form.Item
            className="full-width-form-item highlight-label"
            label={`12 ${t('projectProposal:slcssProjectDetails')}`}
            name="slcssProjectDetails"
            rules={[
              {
                required: true,
                message: `${t('projectProposal:slcssProjectDetails')} ${t('isRequired')}`,
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Row justify={'end'} className="step-actions-end">
            <Button type="primary" size={'large'} htmlType="submit">
              submit
            </Button>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default ProjectProposalComponent;