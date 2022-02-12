import React from 'react';
import { Typography, Space } from 'antd';
import { Steps } from 'antd';

const SideB = ({ currentStep, password }) => {
  const { Title } = Typography;
  const { Step } = Steps;

  return (
    <div className='content2'>
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
        <Step title='Настройки' description='Дополнительные настройки пароля' />
      </Steps>

      <div className={`password ${currentStep !== 4 && 'hide'}`}>
        <Space direction='horizontal' size='small'>
          <Title
            copyable={
              password && password !== '' && currentStep === 4 ? true : false
            }
            level={3}
          >
            {currentStep === 4 && password}
          </Title>
        </Space>
      </div>
    </div>
  );
};

export default SideB;
