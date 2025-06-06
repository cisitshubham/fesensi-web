import clsx from 'clsx';
import { useFormik } from 'formik';
import { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

import { useAuthContext } from '../../useAuthContext';
import { toAbsoluteUrl } from '@/utils';
import { Alert, KeenIcon } from '@/components';
import { useLayout } from '@/providers';
import { Button } from '@/components/ui/button';

const initialValues = {
  first_name: '',
  email: '',
  password: '',
  changepassword: '',
};

const signupSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('User name is required'),
  email: Yup.string()
    .email('Wrong email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Minimum 6 characters')
    .max(50, 'Maximum 50 characters')
    .required('Password is required'),
  changepassword: Yup.string()
    .min(6, 'Minimum 6 characters')
    .max(50, 'Maximum 50 characters')
    .required('Password confirmation is required')
    .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
});

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuthContext();
  const navigate = useNavigate();
  const from = '/auth/login';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { currentLayout } = useLayout();
  const [showDialog, setShowDialog] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        if (register) {
          await register(values.first_name, values.email, values.password);
          setShowDialog(true); // Show the dialog
        } else {
          throw new Error('JWTProvider is required for this form.');
        }
      } catch (error) {
        console.error(error);
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

  const togglePassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  return (
    <div className="max-w-[470px] w-full lg:overflow-y-scroll no-scrollbar">
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className='p-4'>
          <DialogTitle>Signup Successful</DialogTitle>
          <p className="mt-2">Your signup was successful. Waiting for admin approval.</p>
          <div className="flex flex-row justify-between items-center mt-4">
          <Button
            className="w-fit "
            onClick={handleCloseDialog}
          >
            Close
          </Button>
          <Button className='w-fit'>
            <Link to={from} className=" ">
              Go to Login
            </Link>
          </Button>
          </div>
        </DialogContent>
      </Dialog>

      <form
        className="card-body flex flex-col gap-5 p-10"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <div className="text-center text-5xl mb-16 flex  items-center justify-center gap-2">
          <img
            src={toAbsoluteUrl('/media/app/fesensi/logo.svg')}
            className="h-[60px] max-w-none  "
            alt=""
          />
          <h1 className="bg-gradient-to-t from-[#314DCA] to-[#7189f4] flex flex-row gap-1 tracking-wider font-bold uppercase text-nowrap bg-clip-text text-transparent">
             Fesensi
          </h1>
        </div>
        <h1 className="text-2xl font-semibold text-primary-active">Sign up</h1>
        <div className=" text-sm">Create an account to explore all our features </div>
    

        {formik.status && <Alert variant="danger">{formik.status}</Alert>}
        <div className="flex flex-col gap-1">
          <label className="input">
            <input
              placeholder="User name "
              type="text"
              autoComplete="off"
              {...formik.getFieldProps('first_name')}
              className={clsx(
                'form-control bg-transparent',
                { 'is-invalid': formik.touched.first_name && formik.errors.first_name },
                {
                  'is-valid': formik.touched.first_name && !formik.errors.first_name
                }
              )}
            />
          </label>
          {formik.touched.first_name && formik.errors.first_name && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.first_name}
            </span>
          )}
        </div>


        <div className="flex flex-col gap-1">
          <label className="input">
            <input
              placeholder="Email"
              type="email"
              autoComplete="off"
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control bg-transparent',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                {
                  'is-valid': formik.touched.email && !formik.errors.email
                }
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
          <label className="input">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              autoComplete="off"
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.password && formik.errors.password
                },
                {
                  'is-valid': formik.touched.password && !formik.errors.password
                }
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

        <div className="flex flex-col gap-1">
          <label className="input">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              autoComplete="off"
              {...formik.getFieldProps('changepassword')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.changepassword && formik.errors.changepassword
                },
                {
                  'is-valid': formik.touched.changepassword && !formik.errors.changepassword
                }
              )}
            />
            <button type="button" className="btn btn-icon" onClick={toggleConfirmPassword}>
              <KeenIcon
                icon="eye"
                className={clsx('text-gray-500', { hidden: showConfirmPassword })}
              />
              <KeenIcon
                icon="eye-slash"
                className={clsx('text-gray-500', { hidden: !showConfirmPassword })}
              />
            </button>
          </label>
          {formik.touched.changepassword && formik.errors.changepassword && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.changepassword}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary flex justify-center "
          disabled={loading || formik.isSubmitting}
        >
          {loading ? 'Please wait...' : 'Sign Up'}
        </button>
        <div className="mt-4">Have an account? <Link to={'/auth/login'} className="text-blue-500">
          Sign In
        </Link></div>
    
      </form>

    </div>
  );
};

export { Signup };
