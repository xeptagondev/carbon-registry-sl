import React from 'react';
import { ValidationStepsProps } from './StepProps';
import { Row, Button, Form, Input, Col, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { isValidateFileType } from '../../Utils/DocumentValidator';
import { DocType } from '../../Definitions/Enums/document.type';
import TextArea from 'antd/lib/input/TextArea';
import { ProcessSteps } from './ValidationStepperComponent';

const ValidationOpinion = (props: ValidationStepsProps) => {
  const { prev, next, form, current, t, countries, handleValuesUpdate } = props;

  const maximumImageSize = process.env.REACT_APP_MAXIMUM_FILE_SIZE
    ? parseInt(process.env.REACT_APP_MAXIMUM_FILE_SIZE)
    : 5000000;

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish = async (values: any) => {
    const validationOpinionFormValues: any = {
      validationOpinion: values?.validationOpinion,
      firstWitnessDateOfSignature: values?.firstWitnessDateOfSignature,
      firstWitnessDesignation: values?.firstWitnessDesignation,
      firstWitnessName: values?.firstWitnessName,
      firstWitnessSignature: values?.firstWitnessSignature,
      secondWitnessDesignation: values?.secondWitnessDesignation,
      secondWitnessName: values?.secondWitnessName,
      secondWitnessSignature: values?.secondWitnessSignature,
      secondWitnessSignatureDateOfSignature: values?.secondWitnessSignatureDateOfSignature,
    };

    console.log(ProcessSteps.VR_VALIDATION_OPINION, validationOpinionFormValues);
    handleValuesUpdate({ [ProcessSteps.VR_VALIDATION_OPINION]: validationOpinionFormValues });
  };

  return (
    <>
      {current === 5 && (
        <div>
          <div className="step-form-container">
            <Form
              labelCol={{ span: 20 }}
              wrapperCol={{ span: 24 }}
              className="step-form"
              layout="vertical"
              requiredMark={true}
              form={form}
              onFinish={(values: any) => {
                // onFinish(values);
                if (next) {
                  next();
                }
              }}
            >
              <Form.Item
                className="full-width-form-item"
                label={`${t('validationReport:validationOpinion')}`}
                name="validationOpinion"
                rules={[
                  {
                    required: true,
                    message: `${t('validationReport:validationOpinion')} ${t('isRequired')}`,
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>

              <Row justify={'space-between'} gutter={40} className="mg-top-1">
                <Col md={24} xl={10}>
                  <p className="no-margin-p">{t('witness')}</p>

                  <div className="signature-upload">
                    <Form.Item
                      name="firstWitnessSignature"
                      label={t('validationReport:signature')}
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                      // required={true}
                      rules={[
                        {
                          required: true,
                          message: `${t('validationAgreement:required')}`,
                        },
                        {
                          validator: async (rule, file) => {
                            if (file?.length > 0) {
                              if (
                                !isValidateFileType(
                                  file[0]?.type,
                                  DocType.ENVIRONMENTAL_IMPACT_ASSESSMENT
                                )
                              ) {
                                throw new Error(`${t('CMAForm:invalidFileFormat')}`);
                              } else if (file[0]?.size > maximumImageSize) {
                                // default size format of files would be in bytes -> 1MB = 1000000bytes
                                throw new Error(`${t('common:maxSizeVal')}`);
                              }
                            }
                          },
                        },
                      ]}
                    >
                      <Upload
                        accept=".doc, .docx, .pdf, .png, .jpg"
                        beforeUpload={(file: any) => {
                          return false;
                        }}
                        className="design-upload-section"
                        name="design"
                        action="/upload.do"
                        listType="picture"
                        multiple={false}
                        maxCount={1}
                      >
                        <Button className="upload-doc" size="large" icon={<UploadOutlined />}>
                          Upload
                        </Button>
                      </Upload>
                    </Form.Item>
                  </div>
                  <Form.Item
                    name="firstWitnessName"
                    label={t('name')}
                    rules={[
                      {
                        required: true,
                        message: `${t('validationAgreement:required')}`,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="firstWitnessDesignation"
                    label={t('designation')}
                    rules={[
                      {
                        required: true,
                        message: `${t('validationAgreement:required')}`,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="firstWitnessDateOfSignature"
                    label={t('dateOfSignature')}
                    rules={[
                      {
                        required: true,
                        message: `${t('validationAgreement:required')}`,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={24} xl={10}>
                  <p className="no-margin-p">{t('witness')}</p>

                  <div className="signature-upload">
                    <Form.Item
                      name="secondWitnessSignature"
                      label={t('validationReport:signature')}
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                      // required={true}
                      rules={[
                        {
                          required: true,
                          message: `${t('validationAgreement:required')}`,
                        },
                        {
                          validator: async (rule, file) => {
                            if (file?.length > 0) {
                              if (
                                !isValidateFileType(
                                  file[0]?.type,
                                  DocType.ENVIRONMENTAL_IMPACT_ASSESSMENT
                                )
                              ) {
                                throw new Error(`${t('CMAForm:invalidFileFormat')}`);
                              } else if (file[0]?.size > maximumImageSize) {
                                // default size format of files would be in bytes -> 1MB = 1000000bytes
                                throw new Error(`${t('common:maxSizeVal')}`);
                              }
                            }
                          },
                        },
                      ]}
                    >
                      <Upload
                        accept=".doc, .docx, .pdf, .png, .jpg"
                        beforeUpload={(file: any) => {
                          return false;
                        }}
                        className="design-upload-section"
                        name="design"
                        action="/upload.do"
                        listType="picture"
                        multiple={false}
                        maxCount={1}
                      >
                        <Button className="upload-doc" size="large" icon={<UploadOutlined />}>
                          Upload
                        </Button>
                      </Upload>
                    </Form.Item>
                  </div>
                  <Form.Item
                    name="secondWitnessName"
                    label={t('name')}
                    rules={[
                      {
                        required: true,
                        message: `${t('validationAgreement:required')}`,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="secondWitnessDesignation"
                    label={t('designation')}
                    rules={[
                      {
                        required: true,
                        message: `${t('validationAgreement:required')}`,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="secondWitnessSignatureDateOfSignature"
                    label={t('dateOfSignature')}
                    rules={[
                      {
                        required: true,
                        message: `${t('validationAgreement:required')}`,
                      },
                    ]}
                  >
                    <Input />
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
                  onClick={next}
                  // onClick={() => {
                  //   console.log(form.getFieldsValue());
                  // }}
                  // htmlType="submit"
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

export default ValidationOpinion;
