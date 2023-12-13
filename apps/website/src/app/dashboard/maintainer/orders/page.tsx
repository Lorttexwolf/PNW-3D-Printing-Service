import db from "@/app/api/Database";
import { InlinePrinterSelector } from '../../../components/InlinePrinterSelector';
import { InlineFile } from '../../../components/InlineFile';
import PartAcceptButton from './PartAcceptButton';
import PartDenyButton from './PartDenyButton';
import PartCompleteButton from './PartCompleteButton';
import PartFailedButton from './PartFailedButton';
import PartBeginPrintingButton from './PartBeginPrintingButton';
import DropdownSection from '../../../components/DropdownSection';
import InlineStatus from '../../../components/InlineStatus';
import Link from 'next/link';
import { DateOptions } from '@/app/api/util/Constants';
import RequestFulfilledButton from './RequestFulfilledButton';
import Table from '@/app/components/Table';
import { RegularCart } from "lineicons-react";
import FilamentSpoolIcon from "@/app/components/icons/FilamentSpoolIcon";
import { SidebarNavigation } from "@/app/components/SidebarNavigation";

async function RunningPartsTable() {
    var parts = await db`select p.*, owneremail from part as p, request as r where (p.status='printing' or p.status='printed' or p.status='failed') and p.requestid = r.id`;
    var filaments = await db`select id, material, color from filament where id in ${db(parts.map((p) => p.assignedfilamentid))}`;
    var models = await db`select * from model where id in ${db(parts.map((p) => p.modelid))}`;
    var printers = await db`select * from printer;` as { name: string, model: string }[];

    return <Table style={{ maxHeight: "60vh" }}>
        <thead>
            <tr>
                <th>Part Name</th>
                <th>Quantity</th>
                <th>Filament</th>
                <th>Status</th>
                <th>User</th>
                <th>Printer</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {parts.map(part => {
                const model = models.find(m => m.id === part.modelid)!;
                const filament = filaments.find(f => f.id === part.assignedfilamentid);

                return <tr>
                    <td><InlineFile filename={model.name} filepath={model.filepath}></InlineFile></td>
                    <td>{part.quantity}</td>
                    <td>{filament?.material.toUpperCase()} {filament?.color}</td>
                    <td>{part.status == 'printing'
                        ? <InlineStatus status='Printing' color='bg-blue-200'></InlineStatus>
                        : part.status == 'printed'
                            ? <InlineStatus status='Printed' color='bg-green-200'></InlineStatus>
                            : part.status == 'failed'
                                ? <InlineStatus status='Failed' color='bg-red-200'></InlineStatus>
                                : <></>}</td>
                    <td>
                        {part.lastname} {part.owneremail.substring(0, part.owneremail.lastIndexOf('@'))}
                    </td>
                    <td><InlinePrinterSelector
                        partId={part.id}
                        printers={printers}
                        selection={part.assignedprintername}></InlinePrinterSelector></td>
                    <td className='flex gap-2'>
                        {part.status == 'printing'
                            ? <div className='flex gap-2'>
                                <PartCompleteButton part={part.id}></PartCompleteButton>
                                <PartFailedButton part={part.id}></PartFailedButton>
                            </div>
                            : part.status == 'pending'
                                ? <div className='flex gap-2'>
                                    <PartAcceptButton part={part.id}></PartAcceptButton>
                                    <PartDenyButton part={part.id}></PartDenyButton>
                                </div>
                                : part.status == 'queued'
                                    ? <div>
                                        <PartBeginPrintingButton part={part.id}></PartBeginPrintingButton>
                                    </div>
                                    : <></>}
                    </td>
                </tr>
            })}
        </tbody>
    </Table>
}

async function QueuedPartsTable() {
    var parts = await db`select p.*, r.owneremail from part as p, request as r where p.status='queued' and p.requestid=r.id`;
    var models = await db`select * from model where id in ${db(parts.map((p) => p.modelid))}`;
    var filaments = await db`select id, material, color from filament where id in ${db(parts.map((p) => p.assignedfilamentid))}`;
    var printers = await db`select * from printer;` as { name: string, model: string }[];

    return <Table style={{ maxHeight: "60vh" }}>
        <thead>
            <tr>
                <th>Part Name</th>
                <th>Quantity</th>
                <th>Filament</th>
                <th>User</th>
                <th>Printer</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {parts.map((part, index) => {
                let model = models.find((m) => m.id === part.modelid)!;
                let filament = filaments.find(f => f.id === part.assignedfilamentid);
                return (
                    <tr key={part.id}>
                        <td><InlineFile filename={model.name} filepath={model.filepath}></InlineFile></td>
                        <td>{part.quantity}</td>
                        <td>{filament?.material.toUpperCase()} {filament?.color}</td>
                        <td>{part.owneremail.substring(0, part.owneremail.lastIndexOf('@'))}</td>
                        <td><InlinePrinterSelector
                            partId={part.id}
                            printers={printers}
                            selection={part.assignedprintername} /></td>
                        <td>
                            <PartBeginPrintingButton part={part.id} />
                        </td>
                    </tr>
                );
            })}
        </tbody>
    </Table>
}

async function PendingReviewPartsTable() {
    var parts = await db`select p.*, owneremail from part as p, request as r where p.status='pending' and p.requestid = r.id`;
    var models = await db`select * from model where id in ${db(parts.map((p) => p.modelid))}`;
    var filaments = await db`select id, material, color from filament where id in ${db(parts.map((p) => p.assignedfilamentid))}`;

    return <Table style={{ maxHeight: "60vh" }}>
        <thead>
            <tr>
                <th>Part Name</th>
                <th>Quantity</th>
                <th>Filament</th>
                <th>User</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {parts.map(part => {
                let model = models.find((m) => m.id === part.modelid)!;
                let filament = filaments.find(f => f.id === part.assignedfilamentid);
                return (<tr key={part.id}>
                    <td><InlineFile filename={model.name} filepath={model.filepath}></InlineFile></td>
                    <td>{part.quantity}</td>
                    <td>{filament?.material.toUpperCase()} {filament?.color}</td>
                    <td>{part.owneremail.substring(0, part.owneremail.lastIndexOf('@'))}</td>
                    <td className='flex gap-2'>
                        <PartAcceptButton part={part.id}></PartAcceptButton>
                        <PartDenyButton part={part.id}></PartDenyButton>
                    </td>
                </tr>
                );
            })}
        </tbody>
    </Table>
}

export default async function Maintainer({ params }: { params: any }) {
    const requests = await db`select * from request order by submittime asc`;
    const parts = await db`select * from part order by id asc;`;

    return <>
        <SidebarNavigation items={[
            {
                name: "Requests",
                route: "orders",
                icon: (className) => <RegularCart className={`${className}`}></RegularCart>,
                active: true
            },
            {
                name: "Filaments",
                route: "filaments",
                icon: (className, active) => <FilamentSpoolIcon className={`${className} ${active ? 'fill-amber-600' : 'fill-cool-black '}`} />,
                active: false
            }
        ]}></SidebarNavigation>

        <DropdownSection className="mt-4" name='Requests'>
            <Table>
                <thead>
                    <tr>
                        <th>Parts</th>
                        <th>User</th>
                        <th>Status</th>
                        <th>Notes</th>
                        <th>Submitted</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => {
                        const reqParts = parts.filter(p => p.requestid == req.id);

                        return <tr>
                            <td>{req.name || `${reqParts.length} Part(s)`}</td>
                            <td>{req.owneremail.substring(0, req.owneremail.lastIndexOf('@'))}</td>
                            <td>{req.isfulfilled
                                ? <InlineStatus status="Fulfilled" color='bg-green-200'></InlineStatus>
                                : <InlineStatus status='In Progress' color='bg-blue-200'></InlineStatus>
                            }</td>
                            <td className='max-w-md truncate'>{req.notes || <span className="text-gray-500">None supplied</span>}</td>
                            <td>{req.submittime.toLocaleString("en-US", DateOptions)}</td>
                            <td className='flex gap-2'>
                                <Link
                                    className={`text-base px-2 py-1 w-fit text-white rounded-md bg-gray-400 hover:cursor-pointer hover:bg-gray-500`}
                                    href={`/dashboard/maintainer/orders/${req.id}`}>View
                                </Link>
                                {req.isfulfilled ? <></> : <RequestFulfilledButton request={req.id}></RequestFulfilledButton>}
                            </td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </DropdownSection>

        <DropdownSection name='Active Parts' className='mt-8'>
            <RunningPartsTable></RunningPartsTable>
        </DropdownSection>

        <DropdownSection name='Queued Parts' className='mt-8'>
            <QueuedPartsTable></QueuedPartsTable>
        </DropdownSection>

        <DropdownSection name='Pending Parts' className='mt-8'>
            <PendingReviewPartsTable></PendingReviewPartsTable>
        </DropdownSection>
    </>
}