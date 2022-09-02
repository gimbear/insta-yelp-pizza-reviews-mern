import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

import { useGetUserQuery } from '../app/services/user';

export default function Navbar() {
  const userId = useSelector(selectCurrentUser);
  const { data: user } = useGetUserQuery(userId);

  return (
    <nav className="flex items-center justify-between flex-wrap rounded-xl bg-rose-600 p-4 w-full z-10 top-0">
      <div className="flex items-center flex-shrink-0 text-white">
        <Link to="/">
          <h1 className="text-4xl pl-2 font-bold">🍕 Cheezy</h1>
        </Link>
      </div>
      <div
        className="flex items-center justify-between w-auto pt-2"
        id="nav-content"
      >
        <ul className="list-reset flex justify-end flex-1 items-center">
          <li className="mr-1">
            <Link
              to="/home"
              className="font-bold text-xl inline-block py-2 px-2 text-rose-100 hover:text-white"
            >
              Home
            </Link>
          </li>
          <li className="mr-1">
            <Link
              to="/about"
              className="font-bold text-xl inline-block py-2 px-4 text-rose-100 hover:text-white"
            >
              About
            </Link>
          </li>
          {userId ? (
            <>
              <li className="">
                <Link
                  to="/pizza"
                  className="font-bold text-xl inline-block py-2 text-rose-100 hover:text-white"
                >
                  <div className="flex justify-start mr-4 hover:text-white">
                    <p> Add Pizza</p>
                    <FontAwesomeIcon
                      className="text-rose-100"
                      icon={faCirclePlus}
                      size="2xs"
                      fixedWidth
                    />
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="user/profile"
                  className="inline-block hoover:border-white"
                >
                  <div className="relative w-16 h-16 mr-3">
                    <img
                      className="rounded-full border border-gray-100 shadow-sm"
                      src={user?.profileImage.secure_url}
                      alt="profile"
                    />
                  </div>
                </Link>
              </li>
            </>
          ) : (
            <li className="mr-3">
              <button className="font-bold text-xl inline-block px-4 py-2 leading-none border rounded text-rose-100 border-rose-200 hover:border-transparent hover:text-black hover:bg-white">
                <Link to="/login">Login</Link>
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
