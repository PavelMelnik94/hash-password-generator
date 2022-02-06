import { useState, useEffect } from 'react';
import {
  Card,
  Layout,
  Typography,
  Space,
  Tooltip,
  Input,
  Checkbox,
  Button,
  Spin
} from 'antd';
import { getThreeSymbol } from './utils';
import { Steps } from 'antd';
import { BulbOutlined, LinkOutlined, EditOutlined } from '@ant-design/icons';
import { useDebounce } from 'use-debounce';
import * as md5 from 'md5';
import chainTimeout from 'chain-timeout';

import './App.scss';
import 'antd/dist/antd.css';

let find;
let word;
let phrase;
let setting;

function App() {
  const { Header, Content, Footer } = Layout;
  const { Title, Text } = Typography;
  const { Step } = Steps;

  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    address: { key: 'address', value: '' },
    salt: { key: 'salt', value: '' },
    phrase: { key: 'phrase', value: '' },
    dividers: { key: 'dividers', value: false },
    symbols: { key: 'symbols', value: false }
  });

  const [debouncedValue] = useDebounce(form?.address?.value || '', 500);

  useEffect(() => {
    const validate = () => {
      const expression =
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
      const regex = new RegExp(expression);

      regex.test(debouncedValue) ? setIsValid(true) : setIsValid(false);
    };

    if (debouncedValue) {
      validate(debouncedValue);
    }
  }, [debouncedValue]);

  let chain;
  const handle = {
    onChange(e, key) {
      if (key === 'dividers' || key === 'symbols') {
        form[key] = { key, value: !form[key].value };
      } else {
        form[key] = { key: key, value: e.target.value };
      }
      setForm({ ...form });
    },
    generate() {
      const site = form.address.value;
      const salt = form.salt.value;
      const phrases = form.phrase.value;
      const dividers = form.dividers.value;
      const symbols = form.symbols.value;

      setCurrentStep(0);
      chain ? chain.clear() : null;
      chain = chainTimeout(() => {
        setIsLoading(true);
        setCurrentStep(1);
      }, 1000)
        .chainTimeout(
          () => {
            setCurrentStep(2);
          },
          salt ? 600 : 250
        )
        .chainTimeout(
          () => {
            setCurrentStep(3);
          },
          phrases ? 800 : 300
        )
        .chainTimeout(
          () => {
            setCurrentStep(4);
            setIsLoading(false);
          },
          symbols || dividers ? 1000 : 200
        );

      let text = site + salt + phrases;
      let password = md5(text);
      if (symbols) {
        let str = password
          .match(/.{1,3}/g)
          .join('-')
          .slice(0, 8);
        setPassword(str + getThreeSymbol());
      } else if (dividers) {
        let str = password
          .match(/.{1,3}/g)
          .join('-')
          .slice(0, 11);
        setPassword(str);
      } else {
        setPassword(password);
      }
      // setStartAnimation(false);
    }
  };

  window.find = find;
  const animation = () => {
    find = setTimeout(() => {
      setIsLoading(true);
      setCurrentStep(1);
      word = setInterval(() => {
        setCurrentStep(2);
        phrase = setInterval(() => {
          setCurrentStep(3);
          setting = setInterval(() => {
            setCurrentStep(4);
            setIsLoading(false);
            return;
          }, 300);
        }, 1000);
      }, 500);
    });
  };

  return (
    <div className='app'>
      <Layout className='layout'>
        <Header className='header'>
          <div className='logo' />
          <Title style={{ color: 'white' }}>HASH Password generator</Title>
        </Header>
        <Content style={{ padding: '15px 100px', minHeight: '100%' }}>
          <div className='site-layout-content'>
            <div className='content1'>
              <Steps direction='vertical' current={currentStep}>
                <Step
                  title='Поиск сайта'
                  description='Сайт для которого нужно сгенерировать пароль'
                />
                <Step
                  title='Генерация по слову'
                  description='Кодовое слово, что бы сделать пароль сильнее'
                />
                <Step
                  title='Генерация по фразе'
                  description='Пароль будет надёжнее, если будет введена кодовая фраза'
                />
                <Step
                  title='Настройки'
                  description='Дополнительные настройки пароля'
                />
              </Steps>
            </div>
            <div className='content2'>
              <Card title='' style={{ width: 700 }}>
                <Space direction='horizontal'>
                  <Title level={3}>Генератор паролей через хеш-таблицу</Title>
                  <Tooltip title='Вставте в поле ссылку, и генератор зашифрует её через алгоритм хеширования.'>
                    {' '}
                    <BulbOutlined
                      style={{ fontSize: '16px', color: '#181818' }}
                    />{' '}
                  </Tooltip>
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
                    onChange={(e) => handle.onChange(e, 'address')}
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
                    onChange={(e) => handle.onChange(e, 'salt')}
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
                    onChange={(e) => handle.onChange(e, 'phrase')}
                    placeholder='Привет, мир!'
                    prefix={<EditOutlined />}
                  />
                </div>

                <div className='input-group'>
                  <Checkbox
                    checked={form.dividers.value}
                    onChange={(e) => handle.onChange(e, 'dividers')}
                  >
                    Добавить разделители и обрезать до 9 символов
                  </Checkbox>
                </div>
                <div className='input-group'>
                  <Checkbox
                    checked={form.symbols.value}
                    onChange={(e) => handle.onChange(e, 'symbols')}
                  >
                    Добавить три спецсимвола
                  </Checkbox>
                </div>

                <Button
                  style={{ width: '150px' }}
                  disabled={!isValid || isLoading}
                  type='primary'
                  onClick={() => handle.generate()}
                  loading={isLoading}
                >
                  Сгенерировать
                </Button>
              </Card>

              <div className={`password ${currentStep != 4 && 'hide'}`}>
                <Space direction='horizontal' size='small'>
                  <Title
                    copyable={
                      password && password !== '' && currentStep === 4
                        ? true
                        : false
                    }
                    level={2}
                  >
                    {currentStep === 4 && password}
                  </Title>
                </Space>
              </div>
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Pavel Melnik ©2022 Created by Ant Design
        </Footer>
      </Layout>
    </div>
  );
}

export default App;
