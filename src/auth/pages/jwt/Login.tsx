import { type MouseEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { KeenIcon } from '@/components';
import { toAbsoluteUrl } from '@/utils';
import { useAuthContext } from '@/auth';
import { useLayout } from '@/providers';
import { Alert } from '@/components';
import { set } from 'date-fns';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Minimum 6 characters')
    .max(50, 'Maximum 50 characters')
    .required('Password is required'),
  remember: Yup.boolean()
});

const initialValues = {
  email: localStorage.getItem('email') || '',
  password: '',
  remember: false
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation(); 
  const from = location.state?.from?.pathname || '/';
  const [showPassword, setShowPassword] = useState(false);
  const { currentLayout } = useLayout();
  const [error, setError] = useState<string | null>(null);
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setStatus('');



      try {
        if (!login) {
          throw new Error('JWTProvider is required for this form.');
        }

       const res= await login(values.email, values.password);
        if (values.remember) {
          localStorage.setItem('email', values.email);
        } else {

          localStorage.removeItem('email');
        }
        navigate(from, { replace: true });
      } catch(error) {
        const res = localStorage.getItem('response');
        if (res) {
          try {
            const parsedRes = JSON.parse(res);
            setStatus(parsedRes.message);
          } catch (e) {
            setStatus('An error occurred.');
          }
        } else {
          setStatus('An error occurred.');
        }
        setSubmitting(false);
        setLoading(false);
      }
    }
  });

  const togglePassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="max-w-[470px] w-full lg:overflow-y-scroll no-scrollbar">
      <form
        className="card-body flex flex-col gap-5 p-10"
        onSubmit={formik.handleSubmit}
        noValidate
        autoComplete="on"
      >
        <div className="text-center text-5xl mb-16 flex items-center justify-center gap-2">
          <img
            src={toAbsoluteUrl('/media/app/fesensi/logo.svg')}
            className="h-[60px] max-w-none"
            alt=""
          />
          <h1 className="bg-gradient-to-t from-[#314DCA] to-[#7189f4] flex flex-row gap-1 tracking-wider font-bold uppercase text-nowrap bg-clip-text text-transparent">
             Fesensi
          </h1>
        </div>
        <h1 className="text-2xl font-semibold ">Sign in</h1>
        <div className="text-sm">Welcome back! Please enter your details</div>

        {formik.status && <Alert variant="danger">{formik.status}</Alert>}

        <div className="flex flex-col gap-1">
          <label className="input">
            <input
              placeholder="Email"
              type="email"
              autoComplete="email"
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control bg-transparent',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                { 'is-valid': formik.touched.email && !formik.errors.email }
              )}
            />
          </label>
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-1">
            <label className="form-label text-gray-900">Password</label>
            <Link
              to={
                currentLayout?.name === 'auth-branded'
                  ? '/auth/reset-password'
                  : '/auth/classic/reset-password'
              }
              className="text-2sm link shrink-0"
            >
              Forgot Password?
            </Link>
          </div>
          <label className="input">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              autoComplete="current-password"
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control bg-transparent',
                { 'is-invalid': formik.touched.password && formik.errors.password },
                { 'is-valid': formik.touched.password && !formik.errors.password }
              )}
            />
            <button type="button" className="btn btn-icon" onClick={togglePassword}>
              <KeenIcon icon="eye" className={clsx('text-gray-500', { hidden: showPassword })} />
              <KeenIcon
                icon="eye-slash"
                className={clsx('text-gray-500', { hidden: !showPassword })}
              />
            </button>
          </label>
          {formik.touched.password && formik.errors.password && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.password}
            </span>
          )}
        </div>

        <label className="checkbox-group">
          <input
            className="checkbox checkbox-sm"
            type="checkbox"
            autoComplete="off"
            {...formik.getFieldProps('remember')}
          />
          <span className="checkbox-label">Remember me</span>
        </label>

        <button
          type="submit"
          className="btn btn-primary flex justify-center"
          disabled={loading || formik.isSubmitting}
        >
          {loading ? 'Please wait...' : 'Sign In'}
        </button>

        <div className="mt-4">
          Don't have an account? <Link to={'/auth/signup'} className="text-blue-500">Sign Up</Link>
        </div>
      </form>
    </div>
  );
};

export { Login };
