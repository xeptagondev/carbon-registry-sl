import { Button, Col, Form, Row } from 'antd';

import TextArea from 'antd/lib/input/TextArea';

export const AnnexuresStep = (props: any) => {
  const { useLocation, translator, current, form, prev } = props;

  const t = translator.t;
  return (
    <>
      {current === 6 && (
        <div>
          <div className="step-form-container">
            <Form
              labelCol={{ span: 20 }}
              wrapperCol={{ span: 24 }}
              className="step-form"
              layout="vertical"
              requiredMark={true}
              form={form}
              onFinish={(values: any) => console.log('-----form values-------', values)}
            >
              <Row className="row" gutter={[40, 16]}>
                <Col xl={24} md={24}>
                  <div className="step-form-left-col">
                    <Form.Item
                      label={t('monitoringReport:s_noNetHarm')}
                      name="s_noNetHarm"
                      rules={[
                        {
                          required: true,
                          message: `${t('monitoringReport:s_noNetHarm')} ${t('isRequired')}`,
                        },
                      ]}
                    >
                      <TextArea
                        rows={4}
                        placeholder={`${t('monitoringReport:s_noNetHarm')}`}
                        maxLength={6}
                      />
                    </Form.Item>

                    <Form.Item
                      label={t('monitoringReport:s_stakeholderConsultation')}
                      name="s_stakeholderConsultation"
                      rules={[
                        {
                          required: true,
                          message: `${t('monitoringReport:s_stakeholderConsultation')} ${t(
                            'isRequired'
                          )}`,
                        },
                      ]}
                    >
                      <TextArea
                        rows={4}
                        placeholder={`${t('monitoringReport:s_stakeholderConsultation')}`}
                        maxLength={6}
                      />
                    </Form.Item>

                    <Form.Item
                      label={t('monitoringReport:s_afoluSpecificSafeguards')}
                      name="s_afoluSpecificSafeguards"
                      rules={[
                        {
                          required: true,
                          message: `${t('monitoringReport:s_afoluSpecificSafeguards')} ${t(
                            'isRequired'
                          )}`,
                        },
                      ]}
                    >
                      <TextArea
                        rows={4}
                        placeholder={`${t('monitoringReport:s_afoluSpecificSafeguards')}`}
                        maxLength={6}
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row justify={'end'} className="step-actions-end">
                <Button style={{ margin: '0 8px' }} onClick={prev}>
                  Back
                </Button>
                <Button type="primary">Done</Button>
              </Row>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};
