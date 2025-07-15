import { useState,  useContext } from 'react';

import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';

import InputForm from '../../../Components/General/InputForm';
import { AuthContext } from '../../../contexts/auth'

export default function Register({ navigation }) {
  
  //Area das variaveis

  const { signUp, loadingAuth } = useContext(AuthContext)

  const [dadosUsuario, setDadosUsuario] = useState({
    nome: '',
    email: '',
    confEmail:'',
    senha: '',
    confSenha:'',
  });

  const [erros, setErros] = useState({});
  
  
  //Código para verificação de login
  const register = {
  HandleChange: HandleChange = (nome, value) => {
    setDadosUsuario({
      ...dadosUsuario,
      [nome]: value,
    });
  },

  validar: validar = () => {
    let validate = true;
    let errors = {};

    // codigo para confirmação de erros

    if (dadosUsuario.nome === '') {
      validate = false;
      errors.nome = '- Nome de usuário é obrigatório';
    }

    const regExEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (regExEmail.test(dadosUsuario.email) === false) {
      validate = false;
      errors.email = '- E-mail inválido';
    }

    if (dadosUsuario.confEmail !== dadosUsuario.email || dadosUsuario.confEmail == '') {
      validate = false
      errors.confEmail ='- O email deve ser igual ao anterior'
    }

    const regExSenha =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (regExSenha.test(dadosUsuario.senha) === false) {
      validate = false;
      errors.senha =
        '- A senha deve conter no minimo 8 digitos, sendo um deles uma letra maiuscula e um caractere Especial';
    }

    if (dadosUsuario.confSenha !== dadosUsuario.senha || dadosUsuario.confSenha == '') {
      validate = false
      errors.Confsenha ='- A senha igual a anterior'
    }

    setErros(errors);
    return validate;
  },

  HandleRegister: HandleRegister = async() => {
    if(register.validar()) {
      signUp( dadosUsuario )
    } else {
      Alert.alert('Dados Incorretos', 'Verifique os dados e tente novamente!')
    }
  }
}
  return (
    <SafeAreaView style={styles.container}>

        <Text style={styles.title}>Digite seus dados abaixo para cadastro!</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome De Usuário"
          placeholderTextColor="#656571"
          value={dadosUsuario.nome}
          onChangeText={(value) => register.HandleChange('nome', value)}
        />
        {erros.nome && <Text style={styles.erro}>{erros.nome}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#656571"
          value={dadosUsuario.email}
          onChangeText={(value) => register.HandleChange('email', value)}
        />
        {erros.email && <Text style={styles.erro}>{erros.email}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Confirme seu email"
          placeholderTextColor="#656571"
          value={dadosUsuario.confEmail}
          onChangeText={(value) => register.HandleChange('confEmail', value)}
        />
        {erros.confEmail && <Text style={styles.erro}>{erros.confEmail}</Text>}

        <SafeAreaView style={styles.areaPassword}>
           <InputForm
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#656571"
              secureTextEntry={true}
              value={dadosUsuario.senha}
              onChangeText={(value) => register.HandleChange('senha', value)}
            />

        </SafeAreaView>
        
        {erros.senha && <Text style={styles.erro}>{erros.senha}</Text>}

        <SafeAreaView style={styles.areaPassword}>
            <InputForm
              style={styles.input}
              styleButtonHide={styles.BtnHidePassword}
              placeholder="Confirme sua Senha"
              placeholderTextColor="#656571"
              secureTextEntry={true}
              value={dadosUsuario.confSenha}
              onChangeText={(value) => register.HandleChange('confSenha', value)}
            />
        </SafeAreaView>
            
        
        {erros.Confsenha && <Text style={styles.erro}>{erros.Confsenha}</Text>}

        { loadingAuth ? <ActivityIndicator style={styles.loading} size='40' /> :
          <TouchableOpacity style={styles.button} onPress={register.HandleRegister}>
            <Text style={{ color: 'white', fontSize:18 }}> Registrar </Text>
          </TouchableOpacity>
        }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  areaPassword: {
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
  },
  erro: {
    alignSelf: 'flex-start',
    paddingLeft: '17%',
    color: 'red',
    fontSize: 13,
    fontWeight: 'bold',
  },
  title: {
    fontSize:20,
    marginBottom: '10%',
  },
  input: {
    borderBottomWidth: 1,
    padding: 5,
    margin: 5,
    minWidth:300,
    fontSize:17,
    fontWeight:'bold',
  },
  button: {
    width: 250,
    height: 70,
    borderRadius: 10,
    marginTop: '15%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  BtnHidePassword: {
    marginLeft:-25,
  },
  loading: {
    width: 250,
    height: 70,
    borderRadius: 10,
    marginTop: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
