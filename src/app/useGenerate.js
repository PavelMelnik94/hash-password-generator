import React, { useState } from 'react';
import * as md5 from 'md5';
import chainTimeout from 'chain-timeout';
import { getThreeSymbol } from '../utils';

const useGenerate = (data) => {
  const [password, setPassword] = useState('123');
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  let chain;

  const generate = async () => {
    const site = data.address.value;
    const salt = data.salt.value;
    const phrases = data.phrase.value;
    const dividers = data.dividers.value;
    const symbols = data.symbols.value;

    setCurrentStep(0);
    chain && chain.clear();
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

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      window.scrollTo(0, 1000);
    }
  };

  return {
    password,
    currentStep,
    isLoading,
    generate
  };
};

export default useGenerate;
