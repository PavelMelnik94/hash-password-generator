import React from 'react';
import Title from 'antd/lib/typography/Title';
import Layout from 'antd/lib/layout/layout';

const Header = () => {
  const { Header } = Layout;
  return (
    <Header className='header'>
      <div className='logo' />
      <Title classname='slogan' style={{ color: 'white' }}>
        HASH Password generator
      </Title>
    </Header>
  );
};

export default Header;
