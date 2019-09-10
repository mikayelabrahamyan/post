/* eslint-disable react/display-name */
import React, { useState, memo, useEffect, createRef, forwardRef, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ButtonStyled = styled.button`
  background: ${(props) => props.color};
  text-transform: ${(props) => props.uppercase ? 'uppercase' : 'unset'};
  cursor: pointer;
  border: none;
  color: white;
  padding: 9px;
  font-size: 16px;
`;
ButtonStyled.defaultProps = {
    color: `var(--heroColor)`,
    uppercase: false
};
ButtonStyled.propTypes = {
    color: PropTypes.string,
    uppercase: PropTypes.bool
};
export const Button = memo((props) => {
    return <ButtonStyled {...props} >{(props.children)}</ButtonStyled>;
});
Button.propTypes = {
    children: PropTypes.string.isRequired
};

//******************************************************************************************************************************************
const InputStyled = styled.input.attrs({
    type: 'text'
})`
  border-radius: 3px;
  border: 1px solid ${(props) => props.error ? 'red' : props.borderColor};
  padding: 10px;
  font-size: 16px;
`;
InputStyled.propTypes = {
    borderColor: PropTypes.string,
    error: PropTypes.bool
};
InputStyled.defaultProps = {
    borderColor: '#999',
    error: false
};
export const Input = memo((props) => {
    const { onChange: parentonChange, placeholder, errorMessage, validation, ...rest } = props;
    const [error, setError] = useState(false);
    const hendlerChange = useCallback((e) => {
        const currentTarget = e.target;
        if (validation && !validation.test(currentTarget.value)) {
            currentTarget.setCustomValidity((errorMessage));
            setError(true);
        } else {
            currentTarget.setCustomValidity('');
            setError(false);
        }
        parentonChange(currentTarget.name, currentTarget.value);
    }, [errorMessage, parentonChange, validation]);
    return <InputStyled {...rest} placeholder={(placeholder)} error={error} onChange={hendlerChange} />;
});
Input.propTypes = {
    validation: PropTypes.instanceOf(RegExp),
    errorMessage: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
};
Input.defaultProps = {
    validation: new RegExp(''),
    placeholder: undefined,
    errorMessage: 'incorect'
};
//******************************************************************************************************************************************
const Label = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  display: inline-block;
  border-radius: 12px;
  border: none;
  margin: 5px;
`;

const Switch = styled.input.attrs({ type: 'checkbox' })`
  opacity: 0;
  width: 0;
  height: 0;
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.color};
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 12px;
  ${Switch}:checked + & {
    background-color: ${(props) => props.color};
  }
  &::before{
    position: absolute;
    content: "";
    width: 20px;
    height: 20px;
    left: 2px;
    top: 2px;
    background-image: none;
    background-color: #ffffff;
    opacity: 1;
    transition: all .2s linear;
    border-radius: 50%;
    ${Switch}:checked + & {
      left: 22px;
    }
  }
`;
Slider.defaultProps = {
    color: `var(--heroColor)`
};
Slider.propTypes = {
    color: PropTypes.string
};
export const Switcher = memo((props) => {
    // eslint-disable-next-line react/prop-types
    const { label, ...rest } = props;
    return (
        <Label>
            {label}
            <Switch {...rest} />
            <Slider  />
        </Label>
    );
});
//******************************************************************************************************************************************
const ForwardDiv = forwardRef((props, ref) => <div ref={ref} {...props} />);
const SelectWraper = styled(ForwardDiv)`
    width: ${props => props.width};
    position: relative;
    display: inline-block;
`;
//------------------------------------------
const Selected = styled.div`
    color: ${props => props.textColor};
    background-color: ${(props) => props.color};
    padding: 8px 16px 8px ${(props) => props.withImage ? '43px;' : '16px'};
    border: 1px solid transparent;
    border-color: transparent transparent rgba(0, 0, 0, 0.1) transparent;
    cursor: pointer;
    user-select: none;
    &::after{
        position: absolute;
        content: "";
        top: ${(props) => props.open ? '7px;' : '14px;'};
        right: 10px;
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-color: ${(props) => props.open ? 'transparent transparent #fff transparent;' : '#fff transparent transparent transparent;'};
    }
`;
Selected.propTypes = {
    withImage: PropTypes.bool.isRequired,
    color: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    textColor: PropTypes.string.isRequired
};
//--------------------------------------------
const SelectOptionsList = styled.div`
    display: ${(props) => props.open ? 'unset' : 'none'};
    background-color: ${(props) => props.color};
    color: ${(props) => props.textColor};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 99;
`;
SelectOptionsList.propTypes = {
    color: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    textColor: PropTypes.string.isRequired
};
//-----------------------------------------------
const SelectOptions = styled.div`
    position: relative;
    color: ${(props) => props.textColor};
    padding: 8px 16px 8px ${(props) => props.withImage ? '43px;' : '16px'};
    border: 1px solid transparent;
    border-color: transparent transparent rgba(0, 0, 0, 0.1) transparent;
    cursor: pointer;
    user-select: none;
    background-color: ${(props) => props.active ? 'rgba(255,255,255,0.3)' : 'unset'};
    &:hover{
        background-color: rgba(255,255,255,0.3)
    }
`;
SelectOptions.propTypes = {
    withImage: PropTypes.bool.isRequired,
    textColor: PropTypes.string.isRequired,
    active: PropTypes.bool
};
SelectOptions.defaultProps = {
    active: false
};
export const Select = memo((props) => {
    const { data, value, name, onChange, required, color, textColor, width, ...rest } = props;
    let referencWraper = createRef();
    const [currentIndex, setIndex] = useState(data.findIndex(item => item.value === value));
    const [isOpen, setIsOpen] = useState(false);
    function selectHendler(index) {
        onChange(name, data[index].value);
        setIndex(index);
        setIsOpen(false);
    }
    function mouseDownHendler(e) {
        if (referencWraper.current.contains(e.target)) {
            return;
        }
        isOpen && setIsOpen(false);
    }
    useEffect(() => {
        document.addEventListener('mousedown', mouseDownHendler, false);
        return () => {
            document.removeEventListener('mousedown', mouseDownHendler, false);
        };
    });
    const currentImage = (currentIndex >= 0) ? data[currentIndex].image : false;
    const currentText = (currentIndex >= 0) ? data[currentIndex].text : false;
    const hendlerClick = useCallback(() => setIsOpen(!isOpen), [isOpen]);
    return (
        <SelectWraper ref={referencWraper} width={width}>
            <Selected color={color} className='dropdown-flag' textColor={textColor} open={isOpen} withImage={Boolean(currentImage)} onClick={hendlerClick} className='dropdown-list'>
                {currentImage && <span className={`flag-view-m icon-${currentImage}`} />}
                {currentText ? (currentText) : ('Select')}
            </Selected>
            <SelectOptionsList key={currentIndex} color={color} textColor={textColor} open={isOpen} >
                {
                    data.map((item, index) => <SelectOptions textColor={textColor} hidden={index === currentIndex} key={item.value} withImage={Boolean(item.image)} onClick={selectHendler.bind(this, index)}>
                        {Boolean(item.image) && <span className={`flag-view-m icon-${item.image}`} />}
                        {item.text}
                    </SelectOptions>)
                }
            </SelectOptionsList>
        </SelectWraper>
    );
});
Select.defaultProps = {
    color: 'var(--heroColor)',
    textColor: `var(--textColor)`,
    width: '200px'
};
Select.propTypes = {
    color: PropTypes.string,
    textColor: PropTypes.string,
    width: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.any).isRequired,
    value: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};
//******************************************************************************************************** */
const LoadingStyled = styled.div`
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
  & > div {
        position: absolute;
        border: 4px solid ${props => props.color};
        opacity: 1;
        border-radius: 50%;
        animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
    }
    & > div:nth-child(2) {
        animation-delay: -0.5s;
    }
`;

LoadingStyled.defaultProps = {
    color: 'var(--heroColor2)',
    size: 'small'
};

export const Loading = memo((props) => {
    return (
        <LoadingStyled {...props}> <div /><div /> </LoadingStyled>
    );
});
//******************************************************************************************************** */
const InputRange = styled.input.attrs({ type: 'range' })`
    & {
        height: 25px;
        -webkit-appearance: none;
        /* width: 100%; */
    }
    &:focus {
        outline: none;
    }
    &::-webkit-slider-runnable-track {
        width: 100%;
        height: 5px;
        cursor: pointer;
        animate: 0.2s;
        box-shadow: 0px 0px 2px #000000;
        background: ${(props => props.lineColor)};
        border-radius: 1px;
        border: 0px solid #000000;
    }
    &::-webkit-slider-thumb {
        box-shadow: 0px 0px 5px #000000;
        border: 1px solid ${(props => props.lineColor)};
        height: 18px;
        width: 18px;
        border-radius: 9px;
        background: ${(props => props.thumbColor)};
        cursor: pointer;
        -webkit-appearance: none;
        margin-top: -7px;
    }
    &:focus::-webkit-slider-runnable-track {
        background: ${(props => props.lineColor)};
    }
    &::-moz-range-track {
        width: 100%;
        height: 5px;
        cursor: pointer;
        animate: 0.2s;
        box-shadow: 0px 0px 2px #000000;
        background: ${(props => props.lineColor)};
        border-radius: 1px;
        border: 0px solid #000000;
    }
    &::-moz-range-thumb {
        box-shadow: 0px 0px 2px #000000;
        border: 1px solid ${(props => props.lineColor)};
        height: 18px;
        width: 18px;
        border-radius: 9px;
        background: ${(props => props.thumbColor)};
        cursor: pointer;
    }
    &::-ms-track {
        width: 100%;
        height: 5px;
        cursor: pointer;
        animate: 0.2s;
        background: transparent;
        border-color: transparent;
        color: transparent;
    }
    &::-ms-fill-lower {
        background: ${(props => props.lineColor)};
        border: 0px solid #000000;
        border-radius: 2px;
        box-shadow: 0px 0px 2px #000000;
    }
    &::-ms-fill-upper {
        background: ${(props => props.lineColor)};
        border: 0px solid #000000;
        border-radius: 2px;
        box-shadow: 0px 0px 2px #000000;
    }
    &::-ms-thumb {
        margin-top: 1px;
        box-shadow: 0px 0px 2px #000000;
        border: 1px solid ${(props => props.lineColor)};
        height: 18px;
        width: 18px;
        border-radius: 9px;
        background: ${(props => props.thumbColor)};
        cursor: pointer;
    }
    &:focus::-ms-fill-lower {
        background: ${(props => props.lineColor)};
    }
    &:focus::-ms-fill-upper {
        background: ${(props => props.lineColor)};
    }
`;
InputRange.defaultProps = {
    lineColor: 'var(--heroColor)',
    thumbColor: 'var(--heroColor1)'
};
export const Range = memo((props) => {
    return (
        <InputRange {...props} />
    );
});
//***************************************************************************************************

function CheckBoxInput (props) {
    const ref = useRef(null);
    const { indeterminate, ...rest } = props;
    useEffect(() => { ref.current.indeterminate = indeterminate; }, [indeterminate]);
    return <input type='checkbox' ref={ref} {...rest} />;
}
CheckBoxInput.propTypes = {
    indeterminate: PropTypes.bool.isRequired
};
export const CheckBox = memo((props) => {
    const { tooltip, ...rest } = props;
    return (
        <abbr title={tooltip}><CheckBoxInput {...rest} /></abbr>
    );
});
CheckBox.propTypes = {
    tooltip: PropTypes.string,
    indeterminate: PropTypes.bool
};
CheckBox.defaultProps = {
    tooltip: '',
    indeterminate: false
};