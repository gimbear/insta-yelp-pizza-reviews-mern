import React, { useCallback, useState } from 'react';

import { useUpdatePizzaMutation } from '../../app/services/pizzas';
//import Dropzone from 'react-dropzone';

import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

import StarRate from '../utils/starRate';
import DollarRate from '../utils/dollarRating';

import { useForm } from 'react-hook-form';

const EditPizzaForm = (props) => {
  const currentPizza = props.pizza;
  const navigate = useNavigate();
  const [updatePizza] = useUpdatePizzaMutation();
  const [ratingValue, setRatingValue] = useState(
    currentPizza?.rating
  );
  const [costValue, setCostValue] = useState(currentPizza?.cost);
  const [oldFiles, setOldFiles] = useState(currentPizza?.images);
  const [list, setList] = useState([]);
  const [location, setLocation] = useState(currentPizza.location);

  const [myFiles, setMyFiles] = useState([]);

  useCallback(
    (index) => {
      setOldFiles([...oldFiles, index]);
    },
    [oldFiles]
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      setMyFiles([...myFiles, ...acceptedFiles]);
    },
    [myFiles]
  );

  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      pizzaTitle: currentPizza?.pizzaTitle,
      body: currentPizza?.body,
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
      'image/png': ['.png'],
    },
    multiple: true,
    onDrop,
  });

  const removeOldFile = (file) => () => {
    const newOldFile = [...oldFiles];
    newOldFile.splice(newOldFile.indexOf(file), 1);
    setOldFiles(newOldFile);

    setList((list) => [...list, file.cloudinary_id]);
  };

  const removeFile = (file) => () => {
    const newFiles = [...myFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setMyFiles(newFiles);
  };

  const removeAll = () => {
    setMyFiles([]);
  };

  const onSubmit = async (values, e) => {
    try {
      let data = {
        myFiles: myFiles,
        removedFiles: list,
        pizzaTitle: values.pizzaTitle,
        body: values.body,
        location,
        ratingValue,
        costValue,
      };

      const result = await updatePizza({
        id: currentPizza._id,
        data,
      }).unwrap();
      //console.log(result);
      reset(result);
      setRatingValue(0);
      setCostValue(0);
      setMyFiles([]);
      setList([]);
      navigate(-1);
    } catch (err) {
      console.error('could not create post', err);
    }
  };

  const previousThumbs = oldFiles?.map((image) => (
    <li
      className="flex border border-slate-200 rounded my-2"
      key={image.cloudinary_id}
    >
      <div className="">
        <div className="flex items-center justify-between">
          <FontAwesomeIcon
            onClick={removeOldFile(image)}
            className="mx-1"
            icon={faCircleXmark}
            size="lg"
            color="#f77271"
            fixedWidth
          />
          <img
            src={image.url}
            className="w-24 m-2 shadow drop-shadow-md "
            onLoad={() => {}}
            alt="file"
          />
          <p className="mr-4 text-ellipsis overflow-hidden ...">
            {image.cloudinary_id}
          </p>
        </div>
      </div>
    </li>
  ));

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
        src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=places"
      />
      <div className="container max-w border border-slate-300 mx-4 rounded-xl shadow-lg hover:outline-none hover:shadow-outline">
        <div className="mx-3 my-2">
          <form>
            <div className="mb-4">
              <h1 className="flex items-center justify-center font-bold">
                Edit Pizza Post
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
                    defaultValue: currentPizza.location,
                    onChange: (o) => {
                      setLocation(o);
                    },
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
                {...register('body', 'test', { required: true })}
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

          <label
            className="block text-gray-700 text-sm font-bold mt-3"
            htmlFor="rating"
          >
            Current pictures:
          </label>

          <ul>{previousThumbs}</ul>
          <label
            className="block text-gray-700 text-sm font-bold mt-3"
            htmlFor="rating"
          >
            Upload new images:
          </label>
          <ul> {fileInput}</ul>
        </div>
        <div className="mx-3 my-5">
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="disabled:bg-slate-300 disabled:hover:bg-slate-400  shadow appearance-none bg-red-400 hover:bg-red-500 no-underline inlhine-block align-baseline text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );

  return <div>{content}</div>;
};

export default EditPizzaForm;
