import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, KeenIcon } from '@/components';
import { useAuthContext } from '@/auth';
import { useState } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/providers';
import { AxiosError } from 'axios';
import { Resetpassword, updatepassword } from '@/api/api';
import { toast } from 'sonner';

const passwordSchema = Yup.object().shape({
	newPassword: Yup.string()
		.min(6, 'Password must be at least 6 characters')
		.required('New password is required'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('newPassword')], 'Passwords must match')
		.required('Please confirm your new password')
});




const passswordSchema = Yup.object().shape({
	otp: Yup.string()
		.min(6, 'OTP must be at least 6 characters')
		.max(6, 'OTP must be at most 6 characters')
		.required('OTP is required'),
	newPassword: Yup.string()
		.min(6, 'Password must be at least 6 characters')
		.required('New password is required'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('newPassword')], 'Passwords must match')
		.required('Please confirm your new password')
});

const ResetPasswordChange = () => {

	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showNewPasswordConfirmation, setShowNewPasswordConfirmation] = useState(false);

	const formik = useFormik({
		initialValues: {
			newPassword: '',
			confirmPassword: '',
			otp: ''
		},
		validationSchema: passwordSchema,
		onSubmit: async (values, { setStatus, setSubmitting }) => {
			setLoading(true);
			setHasErrors(undefined);

			const data = {
				otp: values.otp,
				password: values.newPassword,
				confirm_password: values.confirmPassword
			}

			try {
				const response = await Resetpassword(data);
				const { success } = response?.data;
				if (response.success) {
					toast.success('Password updated successfully!', { position: "top-center", });
					setLoading(false);
					setSubmitting(false);
					setHasErrors(false);
					setTimeout(() => {
						navigate('/');
					}, 2000);
				}
			}
			catch (error) {
				setLoading(false);
				setSubmitting(false);
				setHasErrors(true);
				setStatus('Invalid OTP or password. Please try again.');
				if (error instanceof AxiosError) {
					const errorMessage = error.response?.data?.message || 'An error occurred';
					setStatus(errorMessage);
				} else {
					setStatus('An unexpected error occurred. Please try again later.');


				}
			}
		}
	});

	return (
		<div className="card max-w-[370px] w-full">
			<form
				className="card-body flex flex-col gap-5 p-10"
				onSubmit={formik.handleSubmit}
				noValidate
			>
				<div className="text-center">
					<h3 className="text-lg font-medium text-gray-900">Reset Password</h3>
					<span className="text-2sm text-gray-700">Enter your new password</span>
				</div>

				{hasErrors && <Alert variant="danger">{formik.status}</Alert>}
				<div className="flex flex-col gap-1">
					<label className="form-label text-gray-900">One Time Password</label>
					<label className="input">
						<input
							type={showNewPassword ? 'text' : 'password'}
							placeholder="Enter OTP"
							autoComplete="off"
							{...formik.getFieldProps('otp')}
							className={clsx(
								'form-control bg-transparent',
								{ 'is-invalid': formik.touched.otp && formik.errors.otp },
								{ 'is-valid': formik.touched.otp && !formik.errors.otp }
							)}
						/>
					</label>
					{formik.touched.otp && formik.errors.otp && (
						<span role="alert" className="text-danger text-xs mt-1">
							{formik.errors.otp}
						</span>
					)}
				</div>

				<div className="flex flex-col gap-1">
					<label className="form-label text-gray-900">New Password</label>
					<label className="input">
						<input
							type={showNewPassword ? 'text' : 'password'}
							placeholder="Enter a new password"
							autoComplete="off"
							{...formik.getFieldProps('newPassword')}
							className={clsx(
								'form-control bg-transparent',
								{ 'is-invalid': formik.touched.newPassword && formik.errors.newPassword },
								{ 'is-valid': formik.touched.newPassword && !formik.errors.newPassword }
							)}
						/>
						<button
							className="btn btn-icon"
							onClick={(e) => {
								e.preventDefault();
								setShowNewPassword(!showNewPassword);
							}}
						>
							<KeenIcon icon="eye" className={clsx('text-gray-500', { hidden: showNewPassword })} />
							<KeenIcon
								icon="eye-slash"
								className={clsx('text-gray-500', { hidden: !showNewPassword })}
							/>
						</button>
					</label>
					{formik.touched.newPassword && formik.errors.newPassword && (
						<span role="alert" className="text-danger text-xs mt-1">
							{formik.errors.newPassword}
						</span>
					)}
				</div>

				<div className="flex flex-col gap-1">
					<label className="form-label font-normal text-gray-900">Confirm New Password</label>
					<label className="input">
						<input
							type={showNewPasswordConfirmation ? 'text' : 'password'}
							placeholder="Re-enter a new Password"
							autoComplete="off"
							{...formik.getFieldProps('confirmPassword')}
							className={clsx(
								'form-control bg-transparent',
								{ 'is-invalid': formik.touched.confirmPassword && formik.errors.confirmPassword },
								{ 'is-valid': formik.touched.confirmPassword && !formik.errors.confirmPassword }
							)}
						/>
						<button
							className="btn btn-icon"
							onClick={(e) => {
								e.preventDefault();
								setShowNewPasswordConfirmation(!showNewPasswordConfirmation);
							}}
						>
							<KeenIcon
								icon="eye"
								className={clsx('text-gray-500', { hidden: showNewPasswordConfirmation })}
							/>
							<KeenIcon
								icon="eye-slash"
								className={clsx('text-gray-500', { hidden: !showNewPasswordConfirmation })}
							/>
						</button>
					</label>
					{formik.touched.confirmPassword && formik.errors.confirmPassword && (
						<span role="alert" className="text-danger text-xs mt-1">
							{formik.errors.confirmPassword}
						</span>
					)}
				</div>

				<button
					type="submit"
					className="btn btn-primary flex justify-center grow"
					disabled={loading}
				>
					{loading ? 'Please wait...' : 'Submit'}
				</button>
			</form>
		</div>
	);
};

export { ResetPasswordChange };
