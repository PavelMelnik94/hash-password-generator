import { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { useDebounce } from 'use-debounce';
import Title from 'antd/lib/typography/Title';

import './App.scss';
import 'antd/dist/antd.css';
import useGenerate from './useGenerate';
import SideA from './partials/SideA';
import SideB from './partials/SideB';

function App() {
  const { Content, Footer, Header } = Layout;
  const [form, setForm] = useState({
    address: { key: 'address', value: '' },
    salt: { key: 'salt', value: '' },
    phrase: { key: 'phrase', value: '' },
    dividers: { key: 'dividers', value: false },
    symbols: { key: 'symbols', value: false }
  });

  const { password, isLoading, currentStep, generate } = useGenerate(form);
  const [isValid, setIsValid] = useState(false);
  const [debouncedValue] = useDebounce(form?.address?.value || '', 500);

  useEffect(() => {
    function vibrating(time) {
      navigator.vibrate =
        navigator.vibrate ||
        navigator.webkitVibrate ||
        navigator.mozVibrate ||
        navigator.msVibrate;
      if (navigator.vibrate) {
        navigator.vibrate(time);
      }
    }

    if (currentStep === 4) vibrating(500);
  }, [currentStep]);

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

  const handle = {
    onChange(e, key) {
      if (key === 'dividers' || key === 'symbols') {
        form[key] = { key, value: !form[key].value };
      } else {
        form[key] = { key: key, value: e.target.value };
      }
      setForm({ ...form });
    }
  };

  return (
    <div className='app'>
      <Layout className='layout'>
        <Header className='header'>
          <div className='logo' />
          <Title className='slogan' style={{ color: 'white' }}>
            HASH Password generator
          </Title>
        </Header>
        <Content style={{ minHeight: '100%' }}>
          <div className='site-layout-content'>
            <SideA
              onChange={handle.onChange}
              isValid={isValid}
              form={form}
              generate={generate}
              isLoading={isLoading}
            />
            <SideB password={password} currentStep={currentStep} />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Pavel Melnik ©2022 created with Ant Design
        </Footer>
      </Layout>
    </div>
  );
}

export default App;
