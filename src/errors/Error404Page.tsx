import useBodyClasses from '@/hooks/useBodyClasses';
import { toAbsoluteUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, ArrowLeft } from 'lucide-react';

const Error404Page = () => {
  useBodyClasses('dark:bg-coal-500');

  return (
    <Fragment>
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md mx-auto text-center space-y-8">
          {/* 404 Image */}
          <div className="relative">
            <img
              src={toAbsoluteUrl('/media/images/fesensi/404.svg') || "/placeholder.svg"}
              className="dark:hidden max-h-[220px] mx-auto"
              alt="404 Error Illustration"
            />
            <div className="absolute -bottom-4 left-0 right-0 flex justify-center">
              <Badge variant="outline" className="bg-background border-primary text-primary px-3 py-1 text-sm font-medium">
                404 Error
              </Badge>
            </div>
          </div>
          
          {/* Error Message */}
          <div className="space-y-4 pt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Oops! Page Not Found
            </h1>
            
            <p className="text-muted-foreground max-w-sm mx-auto">
              We've searched everywhere, but the page you're looking for seems to have gone missing.
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild variant="default" className="w-full sm:w-auto">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Link>
            </Button>
            
        
          </div>
          
          {/* Additional Help Text */}
          <div className="text-sm text-muted-foreground pt-6">
            If you believe this is an error, please{" "}
            <Link to="/contact" className="text-primary font-medium hover:underline">
              contact support
            </Link>.
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export { Error404Page };
