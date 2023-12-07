"use client"

import { changePermission } from "@/app/api/server-actions/account";
import { ChangeEvent, useState, useTransition } from "react";
import { Permission } from "../api/util/Constants";

export interface User {
    email: string,
    name1: string,
    name2: string,
    permission: string
}

function UserRow({user, onChange}: {user: User, onChange: ((email: string, oldPermission: string, newPermission: string) => void)}): JSX.Element {

  let change = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(user.email, user.permission, e.target.value);
  };

  return (
    <tr className="">
      <td className="">{user.email}</td>
      <td className="">{user.name1}</td>
      <td className="">{user.name2}</td>
      <td className="">
        <div className="bg-transparent rounded-sm p-14 pt-10 pb-10 w-full">
          <input type="hidden" name="user-email" value={user.email}/>
          <select name="permission-admin" defaultValue={user.permission} onChange={change} className="rounded-md m-0 inline-block text-black bg-transparent border-gray-700 border">
            <option value="admin">Administrator</option>
            <option value="maintainer">Maintainer</option>
            <option value="user">Normal User</option>
          </select>
        </div>
      </td>
    </tr>
  )
}

export function UserList({users, onChange}: {users: User[], onChange: ((email: string, oldPermission: string, newPermission: string) => void)}): JSX.Element {
  return (
    <table className="bg-white m-auto w-full">
      <thead>
        <tr className="text-gray-400">
          <th className="text-left">Email</th>
          <th className="text-left">First Name</th>
          <th className="text-left">Last Name</th>
          <th className="text-left">Manage User</th>
        </tr>
      </thead>
      <tbody>
        {users.map((e) => <UserRow key={e.email} user={e} onChange={onChange}/>)}
      </tbody>
    </table>
  )
}

//using client component reduces the size of each request to the server.
//instead of sending and grabbing the entire new list of users each server call, 
//only send data about the one user being changed and update the UI client-side.
export function ListOfUserList({normUsers, maintainers, admins}: {normUsers: User[], maintainers: User[], admins: User[]}) {
  //use these states to keep track of when uses are moved into different arrays when their permission changes
  let [userArray, setUserArray] = useState(normUsers);
  let [adminArray, setAdminArray] = useState(admins);
  let [maintainArray, setMaintainArray] = useState(maintainers);

  let [isPending, startTransition] = useTransition();

  //callback will be sent to UserRow component in the <select> element
  //and will be called each time the <select> element is changed
  let onChange = function(email: string, oldPermission: string, newPermission: string) {
    if(oldPermission === newPermission) {
      return;
    }

    //must use in order to use Server Action
    startTransition(async () => {
      let formData = new FormData();
      formData.append("new-permission", newPermission);
      formData.append("user-email", email);
      //server action call
      let errorMessage = await changePermission("", formData);

      //handle error message from changePermission here
      if(errorMessage) { 
        return;
      }

      let user: User;
      
      //filter out user from correct array
      //and update the state
      switch(oldPermission as Permission) {
        case Permission.user:
          user = userArray.find((u) => u.email == email)!;
          setUserArray(userArray.filter((u) => u.email != email));
          break;
        case Permission.maintainer:
          user = maintainArray.find((u) => u.email == email)!;
          setMaintainArray(maintainArray.filter((u) => u.email != email));
          break;
        case Permission.admin:
          user = adminArray.find((u) => u.email == email)!;
          setAdminArray(adminArray.filter((u) => u.email != email));
          break;
        default:
          return;
      }

      user.permission = newPermission; //update permission on client

      //add user to list matching their new permission
      //note that React will only update state if creating a new array and not when mutating an array
      switch(newPermission as Permission) {
        case Permission.user:
          setUserArray([
            ...userArray,
            user
          ]);
          break;
        case Permission.maintainer:
          setMaintainArray([
            ...maintainArray,
            user
          ]);
          break;
        case Permission.admin:
          setAdminArray([
            ...adminArray,
            user
          ]);
          break;
        default:
          return;
      }
    });
  };

  return (
    <div className="bg-white rounded-sm p-14 w-full left">

      <h1 className="w-full pb-4 pt-0 text-left">Admin List</h1>
      <UserList users={adminArray} onChange={onChange}/>

      <h1 className="w-full pb-4 pt-10 text-left">Maintainer List</h1>
      <UserList users={maintainArray} onChange={onChange}/>

      <h1 className="w-full pb-4 pt-10 text-left">User List</h1>
      <UserList users={normUsers} onChange={onChange}/>

    </div>
  );
}