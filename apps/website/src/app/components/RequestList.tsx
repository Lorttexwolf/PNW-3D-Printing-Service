import { Part, Request } from "@/app/api/util/Constants";
import { PartList,} from '@/app/components/PartList';
import { getParts } from '@/app/api/util/GetParts';

async function RequestRow({request}: {request: Request}): Promise<JSX.Element> {
  let parts = await getParts(request.id);

  const options = {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  };

  return (
    <tr className="text-left">
      <td className="w-1/4 p-1">{request.name}<br/>{request.date.toLocaleString("en-US", options)}</td>
      <td className="p-2"><PartList parts={parts}/></td>
    </tr>
  )
}

export function RequestList({requests}: {requests: Request[]}): JSX.Element {
  return (
    <table className="bg-white m-auto w-full">
      <thead>
        <tr className="text-left">
          <th className="w-1/4 text-gray-400">Request</th>
          <th className="flex">
            <p className="w-1/2 text-gray-400">Part Name</p>
            <p className="w-1/6 text-gray-400">Filament</p>
            <p className="w-1/6 text-gray-400">Quantity</p>
            <p className="w-1/6 text-gray-400">Status</p>
          </th>
        </tr>
      </thead>
      <tbody>
        {requests.map((e) => <RequestRow key={e.name} request={e} />)}
      </tbody>
    </table>
  )
}