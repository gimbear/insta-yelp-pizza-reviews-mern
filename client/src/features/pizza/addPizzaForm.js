import React, { useCallback, useState } from 'react';
import { useAddPizzaMutation } from '../../app/services/pizzas';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

import StarRate from '../utils/starRate';
import DollarRate from '../utils/dollarRating';

import { useForm } from 'react-hook-form';

const AddPizzaForm = (props) => {
  const [addPizza, { isLoading }] = useAddPizzaMutation();
  const navigate = useNavigate();
  const [ratingValue, setRatingValue] = useState(0);
  const [costValue, setCostValue] = useState(0);
  const [location, setLocation] = useState(null);
  const [myFiles, setMyFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setMyFiles([...myFiles, ...acceptedFiles]);
    },
    [myFiles]
  );
  const { handleSubmit, register, reset } = useForm();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
      'image/png': ['.png'],
    },
    multiple: true,
    onDrop,
  });

  const removeFile = (file) => () => {
    const newFiles = [...myFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setMyFiles(newFiles);
  };

  const removeAll = () => {
    setMyFiles([]);
  };
  //console.log(location);
  const onSubmit = async (values, e) => {
    try {
      let data = {
        myFiles,
        pizzaTitle: values.pizzaTitle,
        body: values.body,
        ratingValue,
        location,
        costValue,
      };
      //console.log(data);
      const result = await addPizza(data).unwrap();
      reset(result);
      setRatingValue(0);
      setCostValue(0);
      setMyFiles([]);
      navigate('/home');
    } catch (err) {
      console.error('could not create post', err);
    }
  };

  const thumbs = myFiles.map((file) => (
    <li
      className="flex border border-slate-200 rounded my-2"
      key={file.name}
    >
      <div className="">
        <div className="flex items-center justify-between">
          <FontAwesomeIcon
            onClick={removeFile(file)}
            className="mx-1"
            icon={faCircleXmark}
            size="lg"
            color="#f77271"
            fixedWidth
          />
          <img
            src={URL.createObjectURL(file)}
            className="w-24 m-2 shadow drop-shadow-md "
            // Revoke data uri after image is loaded
            onLoad={() => {
              URL.revokeObjectURL(URL.createObjectURL(file));
            }}
            alt="file"
          />
          <p className="mr-4 text-ellipsis overflow-hidden ...">
            {file.path}
          </p>
        </div>
      </div>
    </li>
  ));

  const fileInput = (
    <div className=" my-4 mx-4">
      <div className="border-dashed border-2 border-slate-300">
        <section className="m-4">
          <div {...getRootProps({ className: 'dropzone' })}>
            <input type="File" name="image" {...getInputProps()} />
            <p className="text-center">
              Drag 'n' drop some files here, or click to select files
            </p>
          </div>
        </section>
      </div>
      <div className="">
        <div className="my-2">
          {thumbs.length > 0 && (
            <button
              className="w-full shadow appearance-none bg-red-400 hover:bg-red-500 no-underline inlhine-block align-baseline text-white font-bold py-1 mt-2 rounded focus:outline-none focus:shadow-outline"
              onClick={removeAll}
            >
              Remove All
            </button>
          )}
        </div>
        <ul>{thumbs}</ul>
      </div>
    </div>
  );

  let content = (
    <>
      <script
        type="text/javascript"
        src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE&libraries=places"
      />
      <div className="container max-w border border-slate-300 my-4 rounded-xl shadow-lg hover:outline-none hover:shadow-outline">
        <div className="mx-3 my-2">
          <form>
            <div className="mb-4">
              <h1 className="flex items-center justify-center font-bold">
                Create a new Pizza Post
              </h1>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Pizza Title:
              </label>
              <input
                {...register('pizzaTitle', { required: true })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                name="pizzaTitle"
                type="text"
                placeholder="Title"
              />
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Location:
              </label>
              <div className="my-2">
                <GooglePlacesAutocomplete
                  apiKey="PUT YOUR API KEY HERE"
                  apiOptions={{ language: 'se', region: 'se' }}
                  selectProps={{
                    location,
                    onChange: setLocation,
                  }}
                />
              </div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="message"
              >
                Message:
              </label>
              <textarea
                {...register('body', { required: true })}
                id="body"
                rows="4"
                className="block p-2.5 w-full text-sm shadow appearance-none border rounded"
                placeholder="Your review..."
              ></textarea>
            </div>
          </form>
          <label
            className="block text-gray-700 text-sm font-bold mt-1"
            htmlFor="rating"
          >
            Rating:
          </label>
          <div className="my-2">
            <StarRate
              ratingValue={ratingValue}
              setRatingValue={setRatingValue}
            />
            {/* {console.log(ratingValue)} */}
          </div>
          <label
            className="block text-gray-700 text-sm font-bold mt-1"
            htmlFor="rating"
          >
            Cost rating:
          </label>
          <div className="my-2">
            <DollarRate
              ratingValue={costValue}
              setRatingValue={setCostValue}
            />
            {/* {console.log(ratingValue)} */}
          </div>

          {fileInput}
        </div>
        <div className="mx-3 my-5">
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="disabled:bg-slate-300 disabled:hover:bg-slate-400  shadow appearance-none bg-red-400 hover:bg-red-500 no-underline inlhine-block align-baseline text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline inline-flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                role="status"
                class="inline mr-3 w-5 h-5 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <></>
            )}
            Submit
          </button>
        </div>
      </div>
    </>
  );

  return <div>{content}</div>;
};

export default AddPizzaForm;
