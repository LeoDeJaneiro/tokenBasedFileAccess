import styled, { css } from "styled-components";

const Flex = styled.div`
  display: flex;
  justify-content: center;

  ${(props) =>
    props.start &&
    css`
      justify-content: start;
    `}
  ${(props) =>
    props.space &&
    css`
      justify-content: space-between;
    `}

  ${(props) =>
    props.justify &&
    css`
      justify-content: ${props.justify};
    `}

  flex-direction: row;

  ${(props) =>
    props.column &&
    css`
      flex-direction: column;
    `};
`;

export default Flex;
