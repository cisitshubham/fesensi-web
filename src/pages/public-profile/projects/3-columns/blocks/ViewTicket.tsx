import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Container, MenuLabel } from '@/components';
import { Accordion, AccordionItem } from '@/components/accordion';
import { Link } from 'react-router-dom';
import { Navbar, NavbarActions, NavbarDropdown } from '@/partials/navbar';
import { KeenIcon } from '@/components';
import { getTicketById } from '@/api/api';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

const ViewTicket = () => {
  const [ticket, setTicket] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    getTicketById(id).then((response) => {
      setTicket(response.data);
    });
  }, [id]);

  if (!ticket) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Navbar>
        <MenuLabel className="cursor-default mb-3">Ticket Details</MenuLabel>

        <NavbarActions>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/public-profile/projects/createTickets"
                  className="btn btn-sm btn-primary btn-outline text-blue-800"
                >
                  Create New Ticket
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                <p>Click to create a new ticket</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={`/public-profile/projects/UpdateTicketForm/${id}`}
                  className="btn btn-sm btn-primary btn-outline"
                >
                  Update Ticket
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                <p>Click to update this ticket</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </NavbarActions>
      </Navbar>

      <div className="border rounded-lg shadow-sm p-6 space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border p-3 rounded-lg shadow-sm">
              <h4 className="text-gray-600 text-xs ">Ticket ID</h4>
              <p className="text-gray-800 text-sm">{(ticket as any)?.ticket_number}</p>
            </div>
            <div className="border p-3 rounded-lg shadow-sm">
              <h4 className="text-gray-600 text-xs ">Title</h4>
              <p className="text-gray-800 text-sm">{(ticket as any)?.title}</p>
            </div>
            <div className="col-span-1 md:col-span-2 border p-3 rounded-lg shadow-sm">
              <h4 className="text-gray-600 text-xs ">Description</h4>
              <p className="text-gray-800 text-sm leading-relaxed">
                {(ticket as any)?.description}
              </p>
            </div>
            <div className="border p-3 rounded-lg shadow-sm">
              <h4 className="text-gray-600 text-xs ">Category</h4>
              <p className="text-gray-800 text-sm">{(ticket as any)?.category}</p>
            </div>

            <div className="border p-3 rounded-lg shadow-sm">
              <h4 className="text-gray-600 text-xs ">Priority</h4>
              <p className="text-gray-800 text-sm">{(ticket as any)?.priority}</p>
            </div>
            <div className="border p-3 rounded-lg shadow-sm">
              <h4 className="text-gray-600 text-xs ">Due Date</h4>
              <p className="text-gray-800 text-sm">{(ticket as any)?.due_date}</p>
            </div>
            <div className="border p-3 rounded-lg shadow-sm">
              <h4 className="text-gray-600 text-xs ">Assigned To</h4>
              <p className="text-gray-800 text-sm">{(ticket as any)?.assigned_to}</p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="text-gray-500 text-xs  font-semibold">Attachments</h3>
          <div className="flex gap-4 flex-wrap">
            {(ticket as any)?.attachments?.length ? (
              (ticket as any).attachments.map((file: any) => (
                <a
                  key={file._id}
                  href={file.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={file.file_url}
                    alt="Attachment"
                    className="w-16 h-16 object-cover rounded-lg border hover:opacity-80 transition"
                  />
                </a>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No attachments available</p>
            )}
          </div>
        </div>

        <Accordion>
          <AccordionItem title="Comments">
            <div>
              <div className="border rounded-lg p-4 space-y-4">
                {(ticket as any)?.comments?.length ? (
                  (ticket as any).comments.map((comment: any) => (
                    <div key={comment._id} className="p-3 rounded-lg border mb-3">
                      <p className="text-sm text-gray-800">{comment.comment_text}</p>
                      <div className="text-xs text-gray-500 mt-2">Comment #{comment.sr_no}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No comments available</p>
                )}
              </div>
            </div>
          </AccordionItem>
        </Accordion>
        {/* Escalation Section */}
        <Accordion className="text-gray-700">
          <AccordionItem title="Escalated to Developer">
            <div className="border rounded-lg p-4">
              <p className="text-gray-900 font-medium">
                {(ticket as any)?.escalation || 'No escalation details available'}
              </p>
            </div>
          </AccordionItem>
        </Accordion>

        {/* Audit Log Section */}
        <Accordion className="text-gray-700">
          <AccordionItem title="Activity Log">
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full border-collapse border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-left text-xs font-semibold text-gray-600 ">
                      Date
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-xs font-semibold text-gray-600 ">
                      Action
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-xs font-semibold text-gray-600 ">
                      User Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(ticket as any)?.audit_log?.length ? (
                    (ticket as any)?.audit_log.map((log: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="border border-gray-200 px-4 py-2 text-sm">
                          {format(new Date(log.createdAt), 'dd-MM-yyy HH:mm:ss')}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">{log.action}</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">{log.creator}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="border border-gray-200 px-4 py-2 text-center text-gray-500 text-sm"
                      >
                        No audit logs available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </Container>
  );
};

export default ViewTicket;
