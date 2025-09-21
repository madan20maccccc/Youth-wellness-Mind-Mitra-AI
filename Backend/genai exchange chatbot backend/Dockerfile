    # Start with a standard Python base image
    FROM python:3.10
    
    # Set the working directory inside the container
    WORKDIR /code
    
    # Copy the requirements file into the container
    COPY ./requirements.txt /code/requirements.txt
    
    # Install the Python libraries
    RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
    
    # Copy all of your application files into the container
    COPY . /code/
    
    # Tell the container to expose port 7860 to the internet
    EXPOSE 7860
    
    # The command to run your FastAPI application when the container starts
    CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
    

