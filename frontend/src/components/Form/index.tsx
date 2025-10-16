import FormRoot from './Form';
import Header from './Header';
import Description from './Description';
import Field from './Field';
import Label from './Label';
import Input from './Input';
import ForgotPassword from './ForgotPassword';
import Button from './Button';
import SignUp from './SignUp';

// Compound Component Pattern with Object.assign
const Form = Object.assign(FormRoot, {
  Header,
  Description,
  Field,
  Label,
  Input,
  ForgotPassword,
  Button,
  SignUp,
});

export default Form;
