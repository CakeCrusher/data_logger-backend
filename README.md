# data_logger-backend

## set-up
1. install packages `npm install`
2. create a google cloud account
3. follow [these](https://cloud.google.com/storage/docs/creating-buckets) steps to create a bucket named `speeches_to_transcribe`
4. enable "Cloud Speech-to-Text API" under "APIs and Services" -> "Library"
5. follow [these](https://cloud.google.com/iam/docs/creating-managing-service-account-keys) steps to create and download a service account key
6. add the key to the root directory of the project and name it `voice-logger-key.json`
7. start with `npm run start-dev`
