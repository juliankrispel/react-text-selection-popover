import styled from "styled-components";

export const Bar = styled.div`
  background: ${props => props.bg};
  border-radius: 3px;
  overflow: hidden;
  transition: 300ms;
  white-space: nowrap;
  display: flex;
  user-select: none;
  p {
    margin: 0;
    padding: 1em;
  }
`;

Bar.defaultProps = {
  bg: "#fff"
};

export const Button = styled.button`
  padding: 1em;
  cursor: pointer;
  color: #fff;
  font-size: inherit;
  text-transform: uppercase;
  outline: none;
  font-weight: bold;
  transition: 300ms;
  transform: scale(1);
  &:hover {
    transform: scale(1.15);
  }
  border: none;
  background: ${props => props.bg};
`;

export const Main = styled.main`
  background: #000;
  padding: 2em;
  line-height: 1.5em;
  font-size: 1.3em;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #fff;

  pre {
    padding: 1em;
    line-height: 1.4em;
    font-size: 0.9em;
    color: #fff;
    background: #222;
  }
`;
