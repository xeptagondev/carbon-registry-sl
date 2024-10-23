import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Row } from 'antd';
import moment from 'moment';

const EMISSION_CATEGORY_AVG_MAP: { [key: string]: string } = {
  baselineEmissionReductions: 'avgBaselineEmissionReductions',
  projectEmissionReductions: 'avgProjectEmissionReductions',
  leakageEmissionReductions: 'avgLeakageEmissionReductions',
  netEmissionReductions: 'avgNetEmissionReductions',
};

const NetEmissionReduction = (props: any) => {
  const { form, t } = props;

  const calculateNetGHGEmissions = (value: any, index?: number) => {
    let baselineEmissionReductionsVal = 0;
    let projectEmissionReductionsVal = 0;
    let leakageEmissionReductionsVal = 0;

    console.log('-------cal em is running----------', index);
    if (index === undefined) {
      baselineEmissionReductionsVal = Number(form.getFieldValue('baselineEmissionReductions') || 0);
      projectEmissionReductionsVal = Number(form.getFieldValue('projectEmissionReductions') || 0);
      leakageEmissionReductionsVal = Number(form.getFieldValue('leakageEmissionReductions') || 0);
      const netGHGEmissions =
        baselineEmissionReductionsVal + projectEmissionReductionsVal + leakageEmissionReductionsVal;
      console.log(
        '---------cal em vals----',
        baselineEmissionReductionsVal,
        projectEmissionReductionsVal,
        leakageEmissionReductionsVal,
        netGHGEmissions
      );
      form.setFieldValue('netEmissionReductions', String(netGHGEmissions));
    } else {
      const listVals = form.getFieldValue('extraEmissionReductions');

      if (listVals[index] !== undefined) {
        baselineEmissionReductionsVal = Number(listVals[index].baselineEmissionReductions || 0);
        projectEmissionReductionsVal = Number(listVals[index].projectEmissionReductions || 0);
        leakageEmissionReductionsVal = Number(listVals[index].leakageEmissionReductions || 0);

        const netGHGEmissions =
          baselineEmissionReductionsVal +
          projectEmissionReductionsVal +
          leakageEmissionReductionsVal;

        listVals[index].netEmissionReductions = netGHGEmissions;

        form.setFieldValue('extraEmissionReductions', listVals);
      }
    }
  };

  const CalculateNetTotalEmissions = () => {
    const category = 'netEmissionReductions';
    const categoryToAdd = 'totalNetEmissionReductions';
    let tempTotal = Number(form.getFieldValue(category) || 0);
    const listVals = form.getFieldValue('extraEmissionReductions');
    if (listVals !== undefined && listVals[0] !== undefined) {
      listVals.forEach((item: any) => {
        if (item[category]) {
          tempTotal += Number(item[category]);
        }
      });
    }
    const creditingYears = Number(form.getFieldValue('totalCreditingYears') || 0);
    form.setFieldValue(categoryToAdd, String(tempTotal));
    form.setFieldValue(EMISSION_CATEGORY_AVG_MAP[category], Math.round(tempTotal / creditingYears));
  };

  const calculateTotalEmissions = (value: any, category: string, categoryToAdd: string) => {
    let tempTotal = Number(form.getFieldValue(category) || 0);
    const listVals = form.getFieldValue('extraEmissionReductions');
    if (listVals !== undefined && listVals[0] !== undefined) {
      listVals.forEach((item: any) => {
        if (item[category]) {
          tempTotal += Number(item[category]);
        }
      });
    }
    const creditingYears = Number(form.getFieldValue('totalCreditingYears') || 0);
    form.setFieldValue(categoryToAdd, String(tempTotal));
    form.setFieldValue(EMISSION_CATEGORY_AVG_MAP[category], Math.round(tempTotal / creditingYears));

    CalculateNetTotalEmissions();
  };

  const onPeriodEndChange = (value: any, fieldCounts: number) => {
    let totalCreditingYears = form.getFieldValue('totalCreditingYears') || 0;
    if (value && totalCreditingYears < fieldCounts) {
      totalCreditingYears += 1;
    } else if (value === null && totalCreditingYears !== 0) {
      totalCreditingYears -= 1;
    }
    form.setFieldValue('totalCreditingYears', totalCreditingYears);
    // calculateAvgAnnualERs();
  };

  return (
    <>
      <div className="estimated-emmissions-table-form">
        <Row className="header" justify={'space-between'}>
          <Col md={6} xl={6}>
            Year
          </Col>
          <Col md={3} xl={3}>
            Estimated baseline emissions or removals (tCO2e)
          </Col>
          <Col md={3} xl={3}>
            Estimated project emissions or removals (tCO2e)
          </Col>
          <Col md={3} xl={3}>
            Estimated leakage emissions (tCO2e)
          </Col>
          <Col md={3} xl={3}>
            Estimated net GHG emission reductions or removals (tCO2e)
          </Col>
          <Col md={2} xl={2}>
            {' '}
          </Col>
        </Row>

        <Row justify={'space-between'} align={'middle'}>
          <Col md={6} xl={6} className="col1">
            <Form.Item
              label={``}
              name="emissionsPeriodStart"
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
                picker="month"
                format="YYYY MMM"

                // disabledDate={(currentDate: any) => currentDate < moment().startOf('day')}
              />
            </Form.Item>
            <p>to</p>
            <Form.Item
              label={``}
              name="emissionsPeriodEnd"
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

                    const startDate = moment(form.getFieldValue('emissionsPeriodStart')).startOf(
                      'month'
                    );
                    const selectedDate = moment(value).endOf('month');
                    const duration = moment.duration(selectedDate.diff(startDate));

                    const isOneYear = Math.round(duration.asMonths()) === 12;

                    if (!isOneYear) {
                      throw new Error('Duration should be a year');
                    }
                  },
                },
              ]}
            >
              <DatePicker
                size="large"
                placeholder="End Date"
                picker="month"
                format="YYYY MMM"
                onChange={(value) => onPeriodEndChange(value, 1)}
                disabledDate={(currentDate: any) =>
                  currentDate < moment(form.getFieldValue('emissionsPeriodStart')).startOf('month')
                }
              />
            </Form.Item>
          </Col>
          <Col md={3} xl={3}>
            <Form.Item
              name="baselineEmissionReductions"
              rules={[
                {
                  required: true,
                  message: `${t('CMAForm:required')}`,
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
              <Input
                onChange={(value) => {
                  calculateNetGHGEmissions(value);
                  calculateTotalEmissions(
                    value,
                    'baselineEmissionReductions',
                    'totalBaselineEmissionReductions'
                  );
                }}
              />
            </Form.Item>
          </Col>
          <Col md={3} xl={3}>
            <Form.Item
              name="projectEmissionReductions"
              rules={[
                {
                  required: true,
                  message: `${t('CMAForm:required')}`,
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
              <Input
                onChange={(value) => {
                  calculateNetGHGEmissions(value);
                  calculateTotalEmissions(
                    value,
                    'projectEmissionReductions',
                    'totalProjectEmissionReductions'
                  );
                }}
              />
            </Form.Item>
          </Col>
          <Col md={3} xl={3}>
            <Form.Item
              name="leakageEmissionReductions"
              rules={[
                {
                  required: true,
                  message: `${t('CMAForm:required')}`,
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
              <Input
                onChange={(value) => {
                  calculateNetGHGEmissions(value);
                  calculateTotalEmissions(
                    value,
                    'leakageEmissionReductions',
                    'totalLeakageEmissionReductions'
                  );
                }}
              />
            </Form.Item>
          </Col>
          <Col md={3} xl={3}>
            <Form.Item
              name="netEmissionReductions"
              rules={[
                {
                  required: true,
                  message: `${t('CMAForm:required')}`,
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
              <Input onChange={(value) => calculateNetGHGEmissions(value)} />
            </Form.Item>
          </Col>
          <Col md={2} xl={2}>
            {' '}
          </Col>
        </Row>

        <Form.List name="extraEmissionReductions">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <>
                  <Row justify={'space-between'} align={'middle'}>
                    <Col md={6} xl={6} className="col1">
                      <Form.Item
                        label={``}
                        name={[name, 'emissionsPeriodStart']}
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
                          picker="month"
                          format="YYYY MMM"
                          // disabledDate={(currentDate: any) => currentDate < moment().startOf('day')}
                        />
                      </Form.Item>
                      <p>to</p>
                      <Form.Item
                        label={``}
                        name={[name, 'emissionsPeriodEnd']}
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

                              const startDate = moment(
                                form.getFieldValue('extraEmissionReductions')[name]
                                  .emissionsPeriodStart
                              ).startOf('month');
                              const selectedDate = moment(value).endOf('month');
                              const duration = moment.duration(selectedDate.diff(startDate));

                              const isOneYear = Math.round(duration.asMonths()) === 12;

                              if (!isOneYear) {
                                throw new Error('Duration should be a year');
                              }
                            },
                          },
                        ]}
                      >
                        <DatePicker
                          size="large"
                          placeholder="End Date"
                          picker="month"
                          format="YYYY MMM"
                          onChange={(value) => onPeriodEndChange(value, fields.length + 1)}
                          disabledDate={(currentDate: any) =>
                            currentDate <
                            moment(
                              form.getFieldValue('extraEmissionReductions')[name]
                                .emissionsPeriodStart
                            ).startOf('month')
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col md={3} xl={3}>
                      <Form.Item
                        name={[name, 'baselineEmissionReductions']}
                        rules={[
                          {
                            required: true,
                            message: `${t('CMAForm:required')}`,
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
                        <Input
                          onChange={(value) => {
                            calculateNetGHGEmissions(value, name);
                            calculateTotalEmissions(
                              value,
                              'baselineEmissionReductions',
                              'totalBaselineEmissionReductions'
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col md={3} xl={3}>
                      <Form.Item
                        name={[name, 'projectEmissionReductions']}
                        rules={[
                          {
                            required: true,
                            message: `${t('CMAForm:required')}`,
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
                        <Input
                          onChange={(value) => {
                            calculateNetGHGEmissions(value, name);
                            calculateTotalEmissions(
                              value,
                              'projectEmissionReductions',
                              'totalProjectEmissionReductions'
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col md={3} xl={3}>
                      <Form.Item
                        name={[name, 'leakageEmissionReductions']}
                        rules={[
                          {
                            required: true,
                            message: `${t('CMAForm:required')}`,
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
                        <Input
                          onChange={(value) => {
                            calculateNetGHGEmissions(value, name);
                            calculateTotalEmissions(
                              value,
                              'leakageEmissionReductions',
                              'totalLeakageEmissionReductions'
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col md={3} xl={3}>
                      <Form.Item
                        name={[name, 'netEmissionReductions']}
                        rules={[
                          {
                            required: true,
                            message: `${t('CMAForm:required')}`,
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
                    <Col md={2} xl={2}>
                      <Form.Item>
                        <Button
                          // type="dashed"
                          onClick={() => {
                            // reduceTotalCreditingYears()
                            remove(name);
                            onPeriodEndChange(null, fields.length + 1);
                            calculateTotalEmissions(
                              null,
                              'projectEmissionReductions',
                              'totalProjectEmissionReductions'
                            );
                            calculateTotalEmissions(
                              null,
                              'baselineEmissionReductions',
                              'totalBaselineEmissionReductions'
                            );
                            calculateTotalEmissions(
                              null,
                              'leakageEmissionReductions',
                              'totalLeakageEmissionReductions'
                            );
                          }}
                          size="small"
                          className="addMinusBtn"
                          // block
                          icon={<MinusOutlined />}
                        >
                          {/* Add Entity */}
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ))}

              <Form.Item>
                <Button
                  // type="dashed"
                  onClick={() => {
                    // reduceTotalCreditingYears()
                    add();
                  }}
                  size="middle"
                  className="addMinusBtn"
                  // block
                  icon={<PlusOutlined />}
                >
                  {/* Add Entity */}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Emmissions calculations */}
        {/* calc Row 1 start */}
        <Row justify={'space-between'} align={'top'}>
          <Col md={6} xl={6}>
            Total
          </Col>
          <Col md={3} xl={3} className="total-cols">
            <Form.Item
              name="totalBaselineEmissionReductions"
              rules={[
                {
                  required: true,
                  message: `${t('CMAForm:required')}`,
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
              <Input disabled />
            </Form.Item>
          </Col>
          <Col md={3} xl={3} className="total-cols">
            <Form.Item
              name="totalProjectEmissionReductions"
              rules={[
                {
                  required: true,
                  message: `${t('CMAForm:required')}`,
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
              <Input disabled />
            </Form.Item>
          </Col>
          <Col md={3} xl={3} className="total-cols">
            <Form.Item
              name="totalLeakageEmissionReductions"
              rules={[
                {
                  required: true,
                  message: `${t('CMAForm:required')}`,
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
              <Input disabled />
            </Form.Item>
          </Col>
          <Col md={3} xl={3} className="total-cols">
            <Form.Item
              name="totalNetEmissionReductions"
              rules={[
                {
                  required: true,
                  message: `${t('CMAForm:required')}`,
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
              <Input disabled />
            </Form.Item>
          </Col>
          <Col md={2} xl={2}>
            {' '}
          </Col>
        </Row>
        {/* calc Row 1 end */}

        {/* calc row 2 start */}
        <Row justify={'space-between'} align={'top'}>
          <Col md={6} xl={6}>
            Total number of crediting years
          </Col>
          <Col md={3} xl={3} className="total-cols">
            <Form.Item
              name="totalCreditingYears"
              rules={[
                {
                  required: true,
                  message: `${t('CMAForm:required')}`,
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
              <Input disabled />
            </Form.Item>
          </Col>
          <Col md={3} xl={3}>
            {' '}
          </Col>
          <Col md={3} xl={3}>
            {' '}
          </Col>
          <Col md={3} xl={3}>
            {' '}
          </Col>
          <Col md={2} xl={2}>
            {' '}
          </Col>
        </Row>
        {/* calc row 2 end */}

        {/* calc row 3 start */}
        <Row justify={'space-between'} align={'top'}>
          <Col md={6} xl={6}>
            Annual average over the crediting period
          </Col>
          <Col md={3} xl={3} className="total-cols">
            <Form.Item
              name="avgBaselineEmissionReductions"
              rules={[
                {
                  required: true,
                  message: `${t('CMAForm:required')}`,
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
              <Input disabled />
            </Form.Item>
          </Col>
          <Col md={3} xl={3} className="total-cols">
            <Form.Item
              name="avgProjectEmissionReductions"
              rules={[
                {
                  required: true,
                  message: `${t('CMAForm:required')}`,
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
              <Input disabled />
            </Form.Item>
          </Col>
          <Col md={3} xl={3} className="total-cols">
            <Form.Item
              name="avgLeakageEmissionReductions"
              rules={[
                {
                  required: true,
                  message: `${t('CMAForm:required')}`,
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
              <Input disabled />
            </Form.Item>
          </Col>
          <Col md={3} xl={3} className="total-cols">
            <Form.Item
              name="avgNetEmissionReductions"
              rules={[
                {
                  required: true,
                  message: `${t('CMAForm:required')}`,
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
              <Input disabled />
            </Form.Item>
          </Col>
          <Col md={2} xl={2} className="total-cols">
            {' '}
          </Col>
        </Row>
        {/* calc row 3 end */}
      </div>
    </>
  );
};

export default NetEmissionReduction;
