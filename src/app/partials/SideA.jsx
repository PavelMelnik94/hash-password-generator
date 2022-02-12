import React from 'react';
import { Card, Typography, Space, Input, Checkbox, Button } from 'antd';
import { LinkOutlined, EditOutlined } from '@ant-design/icons';

const SideA = ({ onChange, form, isValid, isLoading, generate = () => {} }) => {
  const { Title, Text } = Typography;
  return (
    <div className='content1'>
      <Card className='mycard' title=''>
        <Space direction='vertical'>
          <Title level={3}>Генератор паролей через хеш-таблицу</Title>
          <Text level={1}>
            Вставте в поле ссылку, и генератор зашифрует её через алгоритм
            хеширования.
          </Text>
        </Space>

        <div className='input-group'>
          <Space direction='vertical'>
            <Text level={2} className='form-label'>
              Адресс сайта*
            </Text>
          </Space>
          <Input
            allowClear
            autoFocus
            value={form.address.value}
            onChange={(e) => onChange(e, 'address')}
            required
            placeholder='https://example.com'
            prefix={<LinkOutlined />}
            className={`${!isValid ? 'input-error' : ''}`}
          />
        </div>
        <div className='input-group'>
          <Space direction='vertical'>
            <Text level={2} className='form-label'>
              Кодовое слово
            </Text>
          </Space>
          <Input
            allowClear
            value={form.salt.value}
            onChange={(e) => onChange(e, 'salt')}
            placeholder='Зеленый'
            prefix={<EditOutlined />}
          />
        </div>
        <div className='input-group'>
          <Space direction='vertical'>
            <Text level={2} className='form-label'>
              Кодовая фраза
            </Text>
          </Space>
          <Input
            allowClear
            value={form.phrase.value}
            onChange={(e) => onChange(e, 'phrase')}
            placeholder='Привет, мир!'
            prefix={<EditOutlined />}
          />
        </div>

        <div className='input-group'>
          <Checkbox
            checked={form.dividers.value}
            onChange={(e) => onChange(e, 'dividers')}
          >
            Добавить разделители и обрезать до 9 символов
          </Checkbox>
        </div>
        <div className='input-group'>
          <Checkbox
            checked={form.symbols.value}
            onChange={(e) => onChange(e, 'symbols')}
          >
            Добавить три спецсимвола
          </Checkbox>
        </div>

        <Button
          style={{ width: '150px' }}
          disabled={!isValid || isLoading}
          type='primary'
          onClick={() => generate()}
          loading={isLoading}
        >
          Сгенерировать
        </Button>
      </Card>
    </div>
  );
};

export default SideA;
